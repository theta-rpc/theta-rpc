import { TransportListeners, ITransport } from '@theta-rpc/core';
import { EventEmitter } from 'events';

import express from 'express';
import http from 'http';
import cors from 'cors';
import { bodyCollectorMiddleware } from './middlewares';

import { IHttpTransportOptions } from './interfaces';

export class HttpTransport extends EventEmitter implements ITransport {
    public readonly name = 'Http transport';
    private server: http.Server;
    private expressDecorator: express.Application;

    private defaultEndpoint = '/';
    private defaultHostname = '127.0.0.1';

    constructor(private options: IHttpTransportOptions) {
        super();

        const decorator = express();
        const server = http.createServer(decorator);
        
        // disable x-powered-by header
        decorator.disable('x-powered-by');

        this.expressDecorator = decorator;
        this.server = server;
    }

    private useFirstLayerMiddlewares() {
        if(this.options.cors) {
            this.expressDecorator.use(cors(this.options.cors));
        }

        this.expressDecorator.use(bodyCollectorMiddleware);
    }

    private onListen() {
        this.server.on('listening', () => this.emit(TransportListeners.THETA_TRANSPORT_STARTED));
    }

    private onMessage() {
        this.expressDecorator.post(this.options.endpoint || this.defaultEndpoint, (req, res) => {
            this.emit(TransportListeners.THETA_INCOMING_MESSAGE, res, req.body);
        });
    }

    private onError() {
        this.server.on('error', (err) => this.emit(TransportListeners.THETA_TRANSPORT_ERROR, err));
    }

    private onClose() {
        this.server.on('close', () => this.emit(TransportListeners.THETA_TRANSPORT_STOPPED));
    }

    private registerEmitters() {
        this.onListen();
        this.onMessage();
        this.onError();
        this.onClose();
    }

    public reply(expected: express.Response, data: string) {
        // empty response ?
        if(data === '') {
          expected.status(204);
        }

        expected.header('Content-Type', 'application/json');

        expected.send(data);
    }

    public start() {
        const { options } = this;
        this.useFirstLayerMiddlewares();
        this.registerEmitters();
        this.server.listen(options.port, options.hostname || this.defaultHostname);
    }

    public stop() {
        this.server.close();
    }
}
