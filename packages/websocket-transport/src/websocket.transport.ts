import { ThetaTransport } from "@theta-rpc/transport";
import createDebug from "debug";
import http from "http";
import WebSocket from "ws";

import { WebSocketTransportOptions, WebSocketContext } from "./interfaces";
import { createWebSocketContext } from "./websocket.context";

const debug = createDebug("THETA-RPC:WEBSOCKET-TRANSPORT");

export class WebSocketTransport extends ThetaTransport {
  private readonly httpServer!: http.Server;
  private readonly wss: WebSocket.Server;
  private readonly defaultPath = "/";
  private readonly defaultPort = 3000;

  constructor(private options: WebSocketTransportOptions) {
    super("WebSocket transport");

    if (options.attach) {
      this.wss = options.attach;
    } else {
      const httpServer = http.createServer();
      const wss = new WebSocket.Server({
        server: httpServer,
        path: options.path || this.defaultPath,
      });
      this.httpServer = httpServer;
      this.wss = wss;
    }

    this.listenEvents();
    this.handleConnection();
    this.handleErrors();
  }

  public static attach(websocket: WebSocket.Server) {
    return new WebSocketTransport({ attach: websocket });
  }

  private handleConnection() {
    this.wss.on("connection", (socket) => {
      socket.on("message", (message) => {
        const context = createWebSocketContext(socket);
        this.emit("message", message, context);
      });
    });
  }

  private handleErrors() {
    if (!this.options.attach) {
      this.wss.on("error", (error) => {
        debug(error);
      });
    }
  }

  private reply(message: unknown, context: WebSocketContext) {
    if (message) {
      const connection = context.getConnection();
      connection.send(JSON.stringify(message));
    }
  }

  private listenEvents() {
    this.on("start", () => this.start());
    this.on("stop", () => this.stop());
    this.on("reply", (message, context) => this.reply(message, context));
  }

  private start() {
    if (this.httpServer.listening || this.options.attach) return;

    const { hostname, port } = this.options;
    this.httpServer.listen(port, hostname, (err?: Error) => {
      if (!err) this.emit("started");
    });
  }

  private stop() {
    if (!this.httpServer.listening || this.options.attach) return;

    this.httpServer.close((err?: Error) => {
      if (!err) this.emit("stopped");
    });
  }
}
