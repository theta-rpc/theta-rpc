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

    if (options.express) {
      expressInstance = options.express;
    } else {
      expressInstance = express();
      this.httpServer = http.createServer(expressInstance);
      expressInstance.disable("x-powered-by");
    }

    this.express = expressInstance;
    this.registerRoute();
    this.listen();
    this.handleErrors();
  }

  private listen() {
    this.on("reply", (data, context) => this.reply(data, context));
    this.on("start", () => this.start());
    this.on("stop", () => this.stop());
  }

  public registerRoute() {
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
        this.emit("message", request.body, context);
      }
    );
  }

  public reply(data: any, context: IHTTPTransportContext) {
    const response = context.getResponse();
    /* istanbul ignore next */
    if (!response.writableEnded) {
      if (!data) {
        return response.status(204).end();
      }

      response.set("Content-Type", "application/json");
      response.send(data);
    }
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

  public start() {
    const { hostname, port, express } = this.options;
    if(express) return;
    if (port) {
      this.httpServer
      .listen(port, hostname, () => this.emit("started"))
    }
  }

  public stop() {
    if (this.options.express) {
      return;
    }
    this.httpServer.close((err) => {
      if(!err) return this.emit("stopped");                     
    });
  }
}
