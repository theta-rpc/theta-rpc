import WebSocket from 'ws';

export interface IWebSocketTransportOptions {
  hostname?: string,
  port: number,
  path?: string
}

export interface IWebSocketTransportContext {
  getConnection(): WebSocket
}
