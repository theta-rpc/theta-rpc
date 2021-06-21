import createDebug from 'debug';
import fs from 'fs';
import net from 'net';
import os from 'os';
import path from 'path';
//@ts-ignore
import * as frame from 'frame-stream';
import { ThetaTransport } from '@theta-rpc/transport';
import { IPCTransportOptions, IPCContext } from './interfaces';
import { createIPCContext } from './ipc.context';

const debug = createDebug('THETA-RPC:IPC-TRANSPORT');

export class IPCTransport extends ThetaTransport {
  private readonly kServer: net.Server;
  private readonly kDefaultPath = path.join(os.tmpdir(), "/jsonrpc.sock");

  constructor(private options: IPCTransportOptions) {
    super("IPC transport");
    this.kServer = options.attach || net.createServer();

    this.listenEvents();
    this.handleErrors();
    this.handleConnection();
    this.tryUnlinkIfSocketExists();
  }

  private handleErrors() {
    if(!this.options.attach) {
      this.kServer.on('error', (err: Error) => {
        debug(err);
      });
    }
  }

  private tryUnlinkIfSocketExists() {
    if(this.options.autoUnlink && !this.options.attach) {
      const path = this.options.path || this.kDefaultPath;
      if(fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    }
  }

  private listenEvents() {
    this.on("start", () => this.start());
    this.on("stop", () => this.stop());
    this.on("reply", (data, context) => this.reply(data, context));
  }

  private reply(data: unknown, context: IPCContext) {
    if (data) {
      const encode = frame.encode();
      encode.pipe(context.getSocket());
      encode.write(JSON.stringify(data));
    }
  }

  public static create(path?: string, autoUnlink = false): IPCTransport {
    return new IPCTransport({ path, autoUnlink });
  }

  public static attach(server: net.Server): IPCTransport {
    return new IPCTransport({ attach: server });
  }

  private handleConnection() {
    this.kServer.on('connection', (socket) => {
      socket.pipe(frame.decode()).on('data', (buf: Buffer) => {
        const context = createIPCContext(socket);
        this.emit('message', buf.toString(), context);
      });
    });
  }

  private start() {
    if(this.options.attach || this.kServer.listening) return;

    const path = this.options.path || this.kDefaultPath;
    this.kServer.listen(path, (err?: Error) => {
      if(!err) this.emit('started');
    });
  }

  private stop() {
    if(this.options.attach || this.kServer.listening) return;

    this.kServer.close((err?: Error) => {
      if(!err) this.emit('stopped');
    });
  }
}
