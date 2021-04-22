import createDebug from "debug";
import { ThetaTransport } from "@theta-rpc/transport";
import { TransportContext } from "./transport-context";
import { TransportsStoreType } from "./types";
import { generateRandomBytes, getSymbolDescr } from "./utils";

const debug = createDebug("THETA-RPC");
const requestDebug = debug.extend("REQUEST-LOG");

export class Composer {
  private transports: TransportsStoreType[] = [];
  constructor() {}

  public load(transports: ThetaTransport[]): void {
    for (const transport of transports) {
      if (transport instanceof ThetaTransport) {
        const signature = Symbol(generateRandomBytes(0x6));
        this.transports.push({ instance: transport, signature });
        debug("[%s@%s]", transport.name, getSymbolDescr(signature));
        continue;
      }
    }
  }

  public onRequest(callback: (data: any, transportContext: any) => any): void {
    this.transports.map(({ instance, signature }) => {
      instance.on('message', (data, transportContext) => {
        console.log(data);
        requestDebug('[%s@%s] -> %o', instance.name, getSymbolDescr(signature), data);
        const context = new TransportContext(transportContext, signature)
        callback(data, context);
      })
    });
  }

  public respond(data: any, transportContext: TransportContext): void {
    const { instance, signature } = this.transports.find(
      (transport) => transport.signature === transportContext.signature
    )!;
    if(!instance.emit('reply', data, transportContext.context)) {
      return requestDebug('[%s@%s] X- %o', instance.name, getSymbolDescr(signature), data);
    }
    requestDebug("[%s@%s] <- %o", instance.name, getSymbolDescr(signature), data);
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.transports.length)
        return reject(new Error("Empty list of transports"));
        Promise.all(this.transports.map(({ instance }) => {
          instance.emit('start');
          return instance.toPromise('started').catch(e => e);
        })).finally(resolve)
    })
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.transports.length)
        return reject(new Error("Empty list of transports"));
        Promise.all(this.transports.map(({ instance }) => {
          instance.emit('stop');
          return instance.toPromise('stopped').catch(e => e);
        })).finally(resolve);
    })
  }
}
