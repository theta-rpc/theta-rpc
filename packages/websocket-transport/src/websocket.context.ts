import WebSocket from "ws";
import { WebSocketContext } from "./interfaces";

const connKey = Symbol("websocket.context.connection");

export class WebSocketContextImpl implements WebSocketContext {
  private [connKey]: WebSocket;

  constructor(private connection: WebSocket) {
    this[connKey] = connection;
  }

  public getConnection() {
    return this.connection;
  }
}

export function isWebSocketContext(context: unknown): boolean {
  return context instanceof WebSocketContextImpl;
}

export function createWebSocketContext(
  connection: WebSocket
): WebSocketContext {
  return new WebSocketContextImpl(connection);
}
