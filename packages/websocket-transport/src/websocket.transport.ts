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
    super("WebSocket transport");

    const httpServer = http.createServer();
    const wss = new WebSocket.Server({
      server: httpServer,
      path: options.path || "/",
    });

    this.httpServer = httpServer;
    this.wss = wss;
    this.handleErrors();
    this.listenEvents();
  }

  private listenEvents() {
    this.on("start", () => this.start());
    this.on("stop", () => this.stop());
    this.on("reply", (data, context) => this.reply(data, context));
    this.wss.on("connection", (socket) => {
      socket.on("message", (data) => {
        const context = this.createContext(socket);
        this.emit("message", data, context);
      });
    });
  }

  public reply(data: any, transportContext: IWebSocketTransportContext) {
    const connection = transportContext.getConnection();
    if (data) {
      connection.send(JSON.stringify(data), (err?: Error) => {
        if(err) debug(err);
      });
    }
  }

  private handleErrors() {
    this.wss.on("error", (err?: Error) => {
      debug(err);
    });
  }

  private createContext(connection: WebSocket) {
    return new WebSocketTransportContext(connection);
  }

  public start() {
    const { port, hostname } = this.options;
    this.httpServer.listen(port, hostname, (err?: Error) => {
      if(!err) this.emit("started")
    });
  }

  public stop() {
    this.httpServer.close((err) => {
      if(!err) this.emit("stopped");
    });
  }
}
