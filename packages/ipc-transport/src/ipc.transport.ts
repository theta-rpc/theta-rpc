import net from 'net';
import NodeIPC from 'node-ipc';
import createDebug from 'debug';
import { ThetaTransport } from '@theta-rpc/transport';
import { IIPCTransportContext, IPCTransportOptionsType } from './interfaces';
import { IPCTransportContext } from './ipc.transport-context';

const debug = createDebug('THETA-RPC:IPC-TRANSPORT');

export class IPCTransport  extends ThetaTransport {
  private readonly ipc = new NodeIPC.IPC();

  constructor(private options: IPCTransportOptionsType) { 
    super('IPC transport');
    this.serve();
    this.setConfig();
    this.listenEvents();
  }

  private setConfig() {
    const options  = this.options;
    for (const key of Object.keys(this.options) as Array<
      keyof typeof options
    >) {
      //TODO: exclude host, port, path, UDPType?
      (this.ipc.config as any)[key] = options[key];
    }
  }

  private serve() {
    const { port, host, path, UDPType } = this.options;
    if (!path && !port) throw new Error("'port' or 'path' must be provided");
    port ? this.ipc.serveNet(host, port, UDPType) : this.ipc.serve(path!);
  }

  private listenEvents() {
    this.on('start', () => this.start());
    this.on('stop', () => this.stop());
    this.on('reply', (data, context) => this.reply(data, context));
    this.ipc.server.on('message', (data, socket) => {
      const context = this.createContext(socket);
      this.emit('message', data, context);
    });
    this.ipc.server.on('error', (err) => debug(err));
  }

  private createContext(socket: net.Socket): IPCTransportContext {
    return new IPCTransportContext(socket);
  }

  private reply(data: any, context: IIPCTransportContext) {
    const socket = context.getSocket();
    if(data && !socket.writableEnded) {
      socket.emit('message', socket, data);
    }
  }

  private start() {
    this.ipc.server.start();
    this.ipc.server.on('start', () => this.emit('started'));
  }

  private stop() {
    this.ipc.server.stop();
    this.ipc.server.on('start', () => this.emit('started'));
  }
}
