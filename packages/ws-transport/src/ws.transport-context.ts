import WebSocket from 'ws';
import { IWsTransportContext } from './interfaces';

export class WsTransportContext implements IWsTransportContext {
  constructor(private connection: WebSocket) {}

  public getConnection() {
    return this.connection;
  }
}
