import { EventEmitter } from 'events';
import http from 'http';
import ws from 'ws';

import { TransportListeners, ITransport } from '@theta-rpc/core';
import { IWsTransportOptions } from './interfaces';

export class WsTransport extends EventEmitter implements ITransport {
    public readonly name = 'WebSocket transport';

    private server: http.Server;
    private wss: ws.Server;

    constructor(private options: IWsTransportOptions) {
        super();

        const server = http.createServer();
        const wss = new ws.Server({ server, path: options.endpoint });

        this.server = server;
        this.wss = wss;
    }

    private onListen() {
        this.wss.on('listening', () => this.emit(TransportListeners.THETA_TRANSPORT_STARTED));
    }

    private onMessage() {
        this.wss.on('connection', (socket) => {
            socket.on('message', (message) => this.emit(TransportListeners.THETA_INCOMING_MESSAGE, socket, message));
        })
    }

    private onError() {
        this.wss.on('error', (error: Error) => this.emit(TransportListeners.THETA_TRANSPORT_ERROR, error));
    }

    private onClose() {
        this.server.on('close', () => { this.emit(TransportListeners.THETA_TRANSPORT_STOPPED) })

    }

    private registerEmitters() {
        this.onListen();
        this.onMessage();
        this.onError();
        this.onClose();
    }

    public reply(expected: any, data: any) {
        expected.send(data);
    }

    public start() {
        const { options } = this;

        this.registerEmitters();

        this.server.listen(options.port, options.hostname);
    }

    public stop() {
        this.server.close();
    }
}
