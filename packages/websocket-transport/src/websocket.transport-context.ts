import WebSocket from 'ws';
import { IWebSocketTransportContext } from './interfaces';

export class WebSocketTransportContext implements IWebSocketTransportContext {
  constructor(private connection: WebSocket) {}

  public getConnection() {
    return this.connection;
  }
}
