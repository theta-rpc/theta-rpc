import net from 'net';
import { IPCContext } from './interfaces';

const kSocket = Symbol('ipc.context.socket');

export class IPCContextImpl implements IPCContext {
  private [kSocket]: net.Socket;

  constructor(socket: net.Socket) {
    this[kSocket] = socket;
  }

  public getSocket(): net.Socket {
    return this[kSocket];
  }
}

export function createIPCContext(socket: net.Socket): IPCContext {
  return new IPCContextImpl(socket);
}

export function isIPCContext(context: unknown): boolean {
  return context instanceof IPCContextImpl;
}

