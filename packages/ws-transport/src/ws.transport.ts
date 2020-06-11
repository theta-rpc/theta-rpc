import { ITransport, ITransportGeneralOptions } from '@theta-rpc/core';
import { IWsTransportOptions } from './interfaces';

import express from 'express';
import expressws from 'express-ws';
import cors from 'cors';

export class WsTransport implements ITransport {
    public readonly name = 'Ws Transport';

    private expressWsDecorator: expressws.Application;
    private express: express.Application

    constructor(private generalOpts: ITransportGeneralOptions, private transportOpts: IWsTransportOptions) {
        const expressInstance = express();
        const { app } = expressws(expressInstance);

        if(transportOpts.cors) {
            app.use(cors(transportOpts.cors));
        }

        this.expressWsDecorator = app;
        this.express = expressInstance;
    }

    public reply(expected: any, data: any): void {
        expected.send(data);
    }

    public onData(listener: (expected: any, data: any) => any): void {
        this.expressWsDecorator.ws(this.transportOpts.endpoint || '/', (ws) => ws.on('message', (data) => listener(ws, data)));
    }

    public onError(listener: (...args: any[]) => any): void {
        this.expressWsDecorator.on('error', listener);
    }

    public onStart(listener: (...args: any[]) => any): void {
        this.expressWsDecorator.on('listening', listener);
    }

    public onStop(listener: (...args: any[]) => any): void {
        this.expressWsDecorator.on('close', listener);
    }

    public start(): void {
        this.expressWsDecorator.listen(this.generalOpts.port, this.generalOpts.hostname || '127.0.0.1', () => this.expressWsDecorator.emit('listening'));
    }
}
