import net from 'net';
import { IIPCTransportContext } from './interfaces';

export class IPCTransportContext implements IIPCTransportContext {
  constructor(private socket: net.Socket) { }

  public getSocket() {
    return this.socket;
  }
}
