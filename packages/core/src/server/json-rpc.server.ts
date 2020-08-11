import { Logger, utils } from '@theta-rpc/common';
import {
    MethodNotfoundError,
    JsonRPCError,
    InternalError,
    ParseError,
    InvalidRequestError
} from '@theta-rpc/errors';

import {
    IServerOptions,
    IConcreteJsonRPCObj,
    ITransport,
    IProbableJsonRPCObj
} from '../interfaces';

import { MethodsContainer } from '../method/methods.container';
import { TransportListeners } from '../constants';
import { JsonRPCValidator } from '../json-rpc.validator';
import { Context } from '../context';

export class JsonRPCServer<TransportOptions> {

    private logger = new Logger('Server');
    private transport!: ITransport;

    constructor(
        private methodsContainer: MethodsContainer,
        options: IServerOptions<TransportOptions>
    ) {
        const { transport, transportOptions } = options;

        const transportInstance = new transport(transportOptions);
        this.logger.info(`Loaded ${transportInstance.name}`);
        this.transport = transportInstance;
    }

    private transportOnStart() {
        this.transport.on(TransportListeners.THETA_TRANSPORT_STARTED, () => {
            this.logger.info('Started');
        });
    }

    private transportOnIncomingMessage() {
        this.transport.on(TransportListeners.THETA_INCOMING_MESSAGE, this.processIncomingMessage.bind(this));
    }

    private transportOnError() {
        this.transport.on(TransportListeners.THETA_TRANSPORT_ERROR, (error: Error) => {
            this.logger.error(error.message);
            process.exit(1);
        });
    }

    private transportOnStop() {
        this.transport.on(TransportListeners.THETA_TRANSPORT_STOPPED, () => {
            this.logger.warning('Stopped');
        });
    }

    private transportListeners() {
        this.transportOnStart();
        this.transportOnIncomingMessage();
        this.transportOnError();
        this.transportOnStop();
    }

    private startTransport() {
        this.transport.start();
    }

    private stopTransport() {
        this.transport.stop();
    }

    private reply(expected: any, data: any) {
        const sanitizedResponse = utils.sanitizeResponse(data, false);

        this.transport.reply(expected, sanitizedResponse ? utils.stringify(sanitizedResponse) : '')
    }

    private async processIncomingMessage(expected: any, data: any) {
        const incomingData = data instanceof ArrayBuffer ? Buffer.from(data).toString('utf-8') : data;
        let result;
        let parsedData;

        try {
            parsedData = JSON.parse(incomingData);
        } catch (e) {
            return this.reply(expected, utils.ErrorResponseTransform(new ParseError(), null))
        }


        if (Array.isArray(parsedData)) {

            if (!parsedData.length) {
                return this.reply(expected, utils.ErrorResponseTransform(new InvalidRequestError(), null));
            }

            result = await Promise.all(parsedData.map((probableRpcObject) => this.callMethod(probableRpcObject, true)));

        } else {
            result = await this.callMethod(parsedData, false);
        }

        this.reply(expected, result);
    }

    private async callMethod(probableRpcObject: IProbableJsonRPCObj, inBatchScope: boolean) {
        try {
            const validated = JsonRPCValidator.validate(probableRpcObject) as IConcreteJsonRPCObj;

            if (this.methodsContainer.exists(validated.method)) {
                const method = this.methodsContainer.get(validated.method)!;

                const context = new Context(
                    validated.id || null,
                    validated.method,
                    validated.params || null,
                    inBatchScope,
                    !(!!validated.id),
                    validated
                );

                const executionResult = await method.handler(context);

                return validated.id ? utils.SuccessResponseTransform(executionResult, validated.id) : false;

            } else {
                throw new MethodNotfoundError();
            }
        } catch (error) {
            if (error instanceof JsonRPCError) {
                return utils.ErrorResponseTransform(error, null);
            }

            this.logger.error(error.message);

            return utils.ErrorResponseTransform(new InternalError(), null);
        }
    }

    public start() {
        this.transportListeners();
        this.startTransport();
    }

    public stop() {
        this.stopTransport();
    }
}
