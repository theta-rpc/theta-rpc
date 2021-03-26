import createDebug from "debug";
import http from "http";
import express from "express";
import corsMiddleware from "cors";

import { ThetaTransport } from "@theta-rpc/transport";

import { IHTTPTransportOptions, IHTTPTransportContext } from "./interfaces";
import { HTTPTransportContext } from "./http.transport-context";

const debug = createDebug("THETA-RPC:HTTP-TRANSPORT");

export class HTTPTransport extends ThetaTransport {
  private httpServer!: http.Server;
  private express!: express.Application;

  constructor(public options: IHTTPTransportOptions) {
    super("HTTP transport");

    let expressInstance: express.Application;

    if(options.express) {
      expressInstance = options.express;
    } else {
      expressInstance = express();
      this.httpServer = http.createServer(expressInstance);
      expressInstance.disable("x-powered-by");
      this.handleErrors();
    }

    this.express = expressInstance;
  }

  public onRequest(callback: (body: any, transportContext: any) => any) {
    const middlewares: any[] = [
      express.raw({
        limit: this.options.bodyLimit,
        type: "application/json",
      }),
    ];

    /* istanbul ignore else */
    if (this.options.cors) {
      middlewares.push(corsMiddleware(this.options.cors));
    }

    this.express.post(
      this.options.path || "/",
      middlewares,
      (request: express.Request, response: express.Response) => {
        const context = this.createContext(request, response);
        callback(request.body, context);
      }
    );
  }

  public reply(data: any, context: IHTTPTransportContext): Promise<void> {
    return new Promise((resolve, reject) => {
      const response = context.getResponse();

      /* istanbul ignore next */
      if (!response.writableEnded) {
        if (!data) {
          response.status(204).end();
          resolve();
          return;
        }

        response.set("Content-Type", "application/json");
        response.send(data);
        resolve();
      }
    });
  }

  public handleErrors() {
    /* istanbul ignore next */
    this.httpServer.on("error", (error) => {
      debug(error);
    });
  }

  public createContext(request: express.Request, response: express.Response) {
    return new HTTPTransportContext(request, response);
  }

  public start(): Promise<void> {
    const { hostname, port, express } = this.options;
    return new Promise((resolve, reject) => {
      if(express) return resolve();
      if(port) {
        this.httpServer.listen(port, hostname, resolve).once("error", reject);
        return;
      }
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if(this.options.express) {
        return resolve();
      }
      this.httpServer.close((err) => {
        /* istanbul ignore next */
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
