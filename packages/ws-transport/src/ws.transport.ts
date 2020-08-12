import { CONSTANTS, ITransport } from '@theta-rpc/common';

import { EventEmitter } from 'events';
import http from 'http';
import ws from 'ws';

import { IWsTransportOptions } from './interfaces';

export class WsTransport extends EventEmitter implements ITransport {
  public readonly name = 'WebSocket transport';

  private httpServer: http.Server;
  private ws: ws.Server;

  private defaultEndpoint = '/';
  private defaultHostname = '127.0.0.1';

  constructor(private options: IWsTransportOptions) {
    super();

    const httpServer = http.createServer();
    const websocket = new ws.Server({ server: httpServer, path: options.endpoint || this.defaultEndpoint });

    this.httpServer = httpServer;
    this.ws = websocket;

    this.registerListeners();
    this.registerEmitters();
  }

  private startedEmitter() {
    this.ws.on('listening', () => this.emit(CONSTANTS.THETA_TRANSPORT_STARTED));
  }

  private errorEmitter() {
    this.ws.on('error', (error: Error) => this.emit(CONSTANTS.THETA_TRANSPORT_ERROR, error));
  }

  private incomingMessageEmitter() {
    this.ws.on('connection', (socket) => {
      socket.on('message', (data) => this.emit(CONSTANTS.THETA_TRANSPORT_INCOMING_MESSAGE, socket, data));
    });
  }

  private stoppedEmitter() {
    this.httpServer.on('close', () => this.emit(CONSTANTS.THETA_TRANSPORT_STOPPED));
  }

  private registerEmitters() {
    this.startedEmitter();
    this.errorEmitter();
    this.incomingMessageEmitter();
    this.stoppedEmitter();
  }

  private startListener() {
    this.on(CONSTANTS.THETA_TRANSPORT_START, () => this.start());
  }

  private replyListener() {
    this.on(CONSTANTS.THETA_TRANSPORT_REPLY, (expected: any, data: string) => this.reply(expected, data));
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

    this.httpServer.listen(options.port, options.hostname || this.defaultHostname);
  }

  private reply(expected: any, data: string) {
    expected.send(data);
  }

  private stop() {
    this.httpServer.close();
  }
}
