import net from 'net';

export interface IPCContext {
  getSocket(): net.Socket;
}

export interface IPCTransportOptions {
  path?: string,
  autoUnlink?: boolean,
  attach?: net.Server
};
