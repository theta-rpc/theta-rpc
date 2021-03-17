import { randomBytes } from "crypto";
import createDebug from "debug";
import { ThetaTransport } from '@theta-rpc/transport';
import { TransportContext } from "./transport-context";
import { TransportOptionsType, TransportsStoreType } from "./types";

const debug = createDebug("THETA-RPC");
const requestDebug = debug.extend("REQUEST-LOG");

export class Composer {
  private transports: TransportsStoreType[] = [];
  constructor() {}

  public load<T>(transports: TransportOptionsType<T>[]): void {
    for (const { transport, options } of transports) {
      const instance = new transport(options);

      if (instance instanceof ThetaTransport) {
        const signature = Symbol(randomBytes(4).toString("hex"));
        this.transports.push({ instance, signature });
        debug("[%s@%s]", instance.name, signature.description);
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
          signature.description,
          data
        );
        const context = new TransportContext(
          this.transports.length === 1 ? transportContext : undefined,
          signature
        );
        callback(data, context);
      });
    });
  }

  public respond(data: any, transportContext: TransportContext): Promise<void> {
    const { instance, signature } = this.transports.find(
      (transport) => transport.signature === transportContext.signature
    )!;
    return new Promise((resolve) => {
      instance
        .reply(data, transportContext.context)
        .then(() => {
          if (data)
            requestDebug(
              "[%s@%s] <- %o",
              instance.name,
              signature.description,
              data
            );
        })
        .catch(() => {
          debug("[%s@%s] X- %o", instance.name, signature.description, data);
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
