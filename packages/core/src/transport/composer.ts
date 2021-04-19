import createDebug from "debug";
import { ThetaTransport } from "@theta-rpc/transport";
import { TransportContext } from "./transport-context";
import { TransportsStoreType } from "./types";

const debug = createDebug("THETA-RPC");
const requestDebug = debug.extend("REQUEST-LOG");

// We can use `symbol.description`, but some browsers don't support it.
// So browser compatibility is better
function getSymbolDescr(symbol: Symbol): string {
  return symbol.toString().slice(7, -1);
}

export class Composer {
  private transports: TransportsStoreType[] = [];
  constructor() {}

  public load(transports: ThetaTransport[]): void {
    for (const transport of transports) {
      if (transport instanceof ThetaTransport) {
        const signature = this.sign();
        this.transports.push({ instance: transport, signature: Symbol(signature) });
        debug("[%s@%s]", transport.name, signature);
        continue;
      }
    }
  }

  private sign() {
    const str = Math.floor(Math.random() * Math.pow(16, 6)).toString(16);
    return "0".repeat(6 - str.length) + str;
  }

  public onRequest(callback: (data: any, transportContext: any) => any): void {
    this.transports.map(({ instance, signature }) => {
      instance.onRequest((data: any, transportContext: any) => {
        requestDebug(
          "[%s@%s] -> %o",
          instance.name,
          getSymbolDescr(signature),
          data
        );
        const context = new TransportContext(transportContext, signature);
        callback(data, context);
      });
    });
  }

  public respond(data: any, transportContext: TransportContext): Promise<void> {
    const { instance, signature } = this.transports.find(
      (transport) => transport.signature === transportContext.signature
    )!;
    return new Promise((resolve) => {
      const signature = getSymbolDescr(transportContext.signature);
      instance
        .reply(data, transportContext.context)
        .then(() => {
          if (data)
            requestDebug("[%s@%s] <- %o", instance.name, signature, data);
        })
        .catch(() => {
          debug("[%s@%s] X- %o", instance.name, signature, data);
        })
        .finally(resolve);
    });
  }

  public start(): Promise<any> {
    if (this.transports.length) {
      return Promise.all(
        this.transports.map((transport) => transport.instance.start())
      );
    }

    return Promise.resolve();
  }

  public stop(): Promise<any> {
    if (this.transports.length) {
      return Promise.all(
        this.transports.map((transport) => transport.instance.stop())
      );
    }

    return Promise.resolve();
  }
}
