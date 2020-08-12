import { CONSTANTS, ITransport } from '@theta-rpc/common';
import { EventEmitter } from 'events';

import express from 'express';
import http from 'http';
import cors from 'cors';
import { bodyCollectorMiddleware } from './middlewares';

import { IHttpTransportOptions } from './interfaces';

export class HttpTransport extends EventEmitter implements ITransport {
    public readonly name = 'HTTP transport';

    private server: http.Server;
    private httpDecorator: express.Application;

    private defaultEndpoint = '/';
    private defaultHostname = '127.0.0.1';

    constructor(private options: IHttpTransportOptions) {
        super();

        const decorator = express();
        const server = http.createServer(decorator);

        // disable x-powered-by header
        decorator.disable('x-powered-by');

        this.server = server;
        this.httpDecorator = decorator;

        this.useFirstLayerMiddlewares();
        this.registerListeners();
        this.registerEmitters();
    }

    private useFirstLayerMiddlewares() {
        if (this.options.cors) {
            this.httpDecorator.use(cors(this.options.cors));
        }

        this.httpDecorator.use(bodyCollectorMiddleware);
    }

    private startedEmitter() {
        this.server.on('listening', () => this.emit(CONSTANTS.THETA_TRANSPORT_STARTED));
    }

    private errorEmitter() {
        this.server.on('error', (error: Error) => this.emit(CONSTANTS.THETA_TRANSPORT_ERROR, error));
    }

    private incomingMessageEmitter() {
        this.httpDecorator.post(this.options.endpoint || this.defaultEndpoint, (req: express.Request, res: express.Response) => {
            this.emit(CONSTANTS.THETA_TRANSPORT_INCOMING_MESSAGE, res, req.body);
        });
    }

    private stoppedEmitter() {
        this.server.on('close', () => this.emit(CONSTANTS.THETA_TRANSPORT_STOPPED));
    }

    private registerEmitters() {
        this.startedEmitter();
        this.errorEmitter();
        this.incomingMessageEmitter();
        this.stoppedEmitter();
    }

    private startListener() {
        this.on(CONSTANTS.THETA_TRANSPORT_START, () => this.start())
    }

    private replyListener() {
        this.on(CONSTANTS.THETA_TRANSPORT_REPLY, (expected: express.Response, data: string) => this.reply(expected, data));
    }

    private stopListener() {
        this.on(CONSTANTS.THETA_TRANSPORT_STOP, () => this.stop());
    }

    private registerListeners() {
        this.startListener();
        this.replyListener();
        this.stopListener();
    }

    private start() {
        const { options } = this;
        this.server.listen(options.port, options.hostname || this.defaultHostname);
    }

    private reply(expected: express.Response, data: string) {
        if (data.length === 0) {
            expected.status(204);
        }

        expected.set('Content-Type', 'application/json');

        expected.send(data);
    }

    private stop() {
        this.server.close();
    }
}
