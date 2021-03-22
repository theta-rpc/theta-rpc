import { randomBytes } from "crypto";
import createDebug from "debug";
import { ThetaTransport } from "@theta-rpc/transport";
import { TransportContext } from "./transport-context";
import { TransportOptionsType, TransportsStoreType } from "./types";

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

  public load<T>(transports: TransportOptionsType<T>[]): void {
    for (const { transport, options } of transports) {
      const instance = new transport(options);

      if (instance instanceof ThetaTransport) {
        const hex = randomBytes(4).toString("hex");
        this.transports.push({ instance, signature: Symbol(hex) });
        debug("[%s@%s]", instance.name, hex);
        continue;
      }
      debug("Invalid transport: %s", transport.name);
    }
  }

  public clearInstances() {
    this.transports = [];
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
