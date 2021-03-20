import { ThetaTransport } from '@theta-rpc/transport';
import createDebug from 'debug';
import http from 'http';
import WebSocket from 'ws';

import { IWebSocketTransportOptions, IWebSocketTransportContext } from './interfaces';
import { WebSocketTransportContext } from './websocket.transport-context';

const debug = createDebug('THETA-RPC:WEBSOCKET-TRANSPORT');

export class WebSocketTransport extends ThetaTransport {
  private httpServer: http.Server;
  private wss: WebSocket.Server;

  constructor(private options: IWebSocketTransportOptions) {
    super('WebSocket transport');

    const httpServer = http.createServer();
    const wss = new WebSocket.Server({ server: httpServer, path: options.path || '/' });

    this.httpServer = httpServer;
    this.wss = wss;
    this.handleErrors();
  }

  public reply(data: any, transportContext: IWebSocketTransportContext): Promise<void> {
    const connection = transportContext.getConnection();
    return new Promise((resolve, reject) => {
      if(data) {
        connection.send(JSON.stringify(data), (error?: Error) => {
          if(error) {
            debug(error);
            reject();
            return;
          }
          resolve();
        });
      }
    });
  }

  public onRequest(cb: (data: any, transportContext: any) => any) {
    this.wss.on('connection', (socket) => {
      socket.on('message', (data) => {
        const context = this.createContext(socket);
        cb(data, context);
      })
    })
  }

  private handleErrors() {
    this.wss.on('error', (error) => {
      debug(error);
    })
  }

  private createContext(connection: WebSocket) {
    return new WebSocketTransportContext(connection);
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServer.listen(this.options.port, this.options.hostname, resolve).once('error', reject);
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServer.close((err) => {
        err ? reject() : resolve();
      });
    });
  }
}
