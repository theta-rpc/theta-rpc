import { IJsonRPCServerOptions, ITransport } from '../interfaces';
import { Logger, Type } from '@theta-rpc/common';

export class JsonRPCServer {
    private logger = new Logger("Server");
    private transport!: ITransport;

    constructor(private options: IJsonRPCServerOptions) { }

    public setTransport<T>(transport: Type<ITransport>, transportOptions: T): this {
        const transportInstance = new transport(this.options, transportOptions);
        this.transport = transportInstance;
        return this;
    }

    private registerTransportListeners(): void {
        this.transport.onStart(() => {
            this.logger.info('Server started');
        });

        this.transport.onError((e: Error) => {
            this.logger.error(e.message);
        });

        this.transport.onStop(() => {
            this.logger.info('Server stopped');
        });

        this.transport.onData(this.processIncomingData.bind(this));
    }

    public processIncomingData(expected: any, data: any): void {
        this.logger.warning('Incoming message: ' + data);
        this.transport.reply(expected, 'reply!');
    }

    public activate(): void {
        this.logger.info('Loaded ' + this.transport.name);
        this.registerTransportListeners();
        this.transport.start();
    }

}
