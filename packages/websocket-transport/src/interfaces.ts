import WebSocket from "ws";

export interface WebSocketTransportOptions {
  hostname?: string;
  port?: number;
  path?: string;
  attach?: WebSocket.Server;
}

export interface WebSocketContext {
  getConnection(): WebSocket;
}
