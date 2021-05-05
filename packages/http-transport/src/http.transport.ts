import createDebug from "debug";
import http from "http";
import https from "https";
import express from "express";
import corsMiddleware from "cors";

import { ThetaTransport } from "@theta-rpc/transport";

import {
  HTTPTransportOptionsType,
  HTTPTransportContextType,
  CommonOptionsType,
} from "./types";
import { HTTPTransportContext } from "./http.transport-context";

const debug = createDebug("THETA-RPC:HTTP-TRANSPORT");

export class HTTPTransport extends ThetaTransport {
  private server!: http.Server | https.Server;
  private express!: express.Application;

  constructor(public options: HTTPTransportOptionsType) {
    super("HTTP transport");

    const expressInstance = options.express ? options.express : express();

    if (!options.http && !options.https && !options.express) {
      throw new Error();
    }

    this.server = options.http
      ? http.createServer(options.http, expressInstance)
      : https.createServer(options.https!, expressInstance);
    
    expressInstance.disable("x-powered-by");

    this.express = expressInstance;
    this.registerRoute();
    this.listen();
    this.handleErrors();
  }

  public static attach(express: express.Application) {
    return new HTTPTransport({ express });
  }

  public static http(options: CommonOptionsType & http.ServerOptions) {
    return new HTTPTransport({ http: options });
  }

  public static https(options: CommonOptionsType & https.ServerOptions) {
    return new HTTPTransport({ https: options });
  }

  private listen() {
    this.on("reply", (data, context) => this.reply(data, context));
    this.on("start", () => this.start());
    this.on("stop", () => this.stop());
  }

  public registerRoute() {
    const options = (this.options.http ||
      this.options.https) as CommonOptionsType;

    const middlewares: any[] = [
      express.raw({
        limit: options.bodySize,
        type: "application/json",
      }),
    ];

    /* istanbul ignore else */
    if (options.cors) {
      middlewares.push(corsMiddleware(options.cors));
    }

    this.express.post(
      options.path || "/",
      middlewares,
      (request: express.Request, response: express.Response) => {
        const context = this.createContext(request, response);
        this.emit("message", request.body, context);
      }
    );
  }

  public reply(data: any, context: HTTPTransportContextType) {
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
    if (!this.options.express) {
      /* istanbul ignore next */
      this.server.on("error", (error) => {
        debug(error);
      });
    }
  }

  public createContext(request: express.Request, response: express.Response) {
    return new HTTPTransportContext(request, response);
  }

  public start() {
    if (this.options.express) return;
    const { hostname, port } = (this.options.http ||
      this.options.https) as CommonOptionsType;
    if (port) {
      this.server.listen(port, hostname, () => this.emit("started"));
    }
  }

  public stop() {
    if (this.options.express) return;
    this.server.close((err) => {
      if (!err) return this.emit("stopped");
    });
  }
}
