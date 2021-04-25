import net from 'net';
import NodeIPC from 'node-ipc';

export interface IIPCTransportContext {
  getSocket(): net.Socket;
}
export type IPCTransportOptionsType  = {
  host?: string,
  port?: number,
  path?: string,
  UDPType?: "udp4" | "udp6"
} & Partial<typeof NodeIPC.config>;
