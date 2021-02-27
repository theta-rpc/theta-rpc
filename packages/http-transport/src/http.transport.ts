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
  private httpServerDecorator!: express.Application;

  constructor(public options: IHTTPTransportOptions) {
    super("HTTP transport");
    const decorator = options.express ? options.express : express();
    const server = http.createServer(decorator);
    decorator.disable("x-powered-by");

    if (options.cors) {
      decorator.use(corsMiddleware(options.cors));
    }

    this.httpServer = server;
    this.httpServerDecorator = decorator;
    this.handleErrors();
  }

  public onRequest(
    callback: (body: string | Buffer, transportContext: any) => any
  ) {
    this.httpServerDecorator.post(
      this.options.path || "/",
      express.raw({
        limit: this.options.bodyLimit || "1mb",
        type: "application/json",
      }),
      (request: express.Request, response: express.Response) => {
        const context = this.createContext(request, response);
        callback(request.body, context);
      }
    );
  }

  public reply(
    data: object | null,
    context: IHTTPTransportContext
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const response = context.getResponse();

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
    this.httpServer.on("error", (error) => {
      debug(error);
    });
  }

  public createContext(request: express.Request, response: express.Response) {
    return new HTTPTransportContext(request, response);
  }

  public start(): Promise<void> {
    const { hostname, port } = this.options;
    return new Promise((resolve, reject) => {
      this.httpServer.listen(port, hostname, resolve).on("error", reject);
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServer.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}
