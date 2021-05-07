import createDebug from "debug";
import http from "http";
import https from "https";
import { ThetaTransport } from "@theta-rpc/transport";
import { RouteGenericInterface } from "fastify/types/route";
import createFastifyApplication, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RawServerBase,
  RawServerDefault,
} from "fastify";
import {
  HTTPTransportOptionsType,
  HTTPTransportContextType,
  CommonOptionsType,
} from "./types";
import { HTTPTransportContext } from "./http.transport-context";

const debug = createDebug("THETA-RPC:HTTP-TRANSPORT");

export class HTTPTransport<
  RawServer extends RawServerBase = RawServerDefault
> extends ThetaTransport {
  private readonly server: FastifyInstance<RawServer>;

  constructor(private options?: HTTPTransportOptionsType<RawServer>) {
    super("HTTP transport");

    if (!options || (!options.attach && !options.http && !options.https)) {
      throw new Error('One of "attach", "http", "https" must be provided');
    }

    let serverOptions = {};

    if (options.https) {
      serverOptions = { https: options.https };
    }

    this.server = createFastifyApplication(serverOptions) as any;

    this.listenEvents();
    this.registerRoute();
    this.handleErrors();
    this.overwriteJSONParser();
  }

  private overwriteJSONParser() {
    this.server.addContentTypeParser(
      "application/json",
      { parseAs: "string" },
      (request, payload, done) => {
        done(null, payload);
      }
    );
  }

  public static attach<T extends RawServerBase>(
    application: FastifyInstance<T>
  ) {
    return new HTTPTransport<T>({ attach: application });
  }

  public static http(options: CommonOptionsType & http.ServerOptions) {
    return new HTTPTransport({ http: options });
  }

  public static https(options: CommonOptionsType & https.ServerOptions) {
    return new HTTPTransport<https.Server>({ https: options });
  }

  private getCommonOptions() {
    return (this.options!.http || this.options!.https) as CommonOptionsType;
  }

  private listenEvents() {
    this.on("reply", (data, context) => this.reply(data, context));
    this.on("start", () => this.start());
    this.on("stop", () => this.stop());
  }

  public registerRoute() {
    const options = this.getCommonOptions();

    this.server.post(
      options.path || "/",
      {
        preHandler: (request, reply, done) => {
          if (request.headers["content-type"] !== "application/json") {
            request.body = "";
          }
          done();
        },
      },
      (request, reply) => {
        const context = this.createContext(request, reply);
        this.emit("message", request.body, context);
      }
    );
  }

  public reply(data: any, context: HTTPTransportContextType<RawServer>) {
    const reply = context.getReply();
    if (!reply.sent) {
      if (!data) {
        reply.status(204).send();
        return;
      }

      reply.header("Content-Type", "application/json");
      reply.send(JSON.stringify(data));
    }
  }

  private handleErrors() {
    this.server.setErrorHandler((error, request, reply) => {
      debug(error);
      reply.status(444).send();
    });
  }

  public createContext(
    request: FastifyRequest<RouteGenericInterface, RawServer>,
    reply: FastifyReply<RawServer>
  ) {
    return new HTTPTransportContext(request, reply);
  }

  public start() {
    const { hostname, port } = this.getCommonOptions();

    if (!this.options!.attach) {
      this.server
        .listen(port, hostname)
        .then(() => this.emit("started"))
        .catch(debug);
    }
  }

  public stop() {
    if (!this.options!.attach) {
      this.server.close().then(() => this.emit("stopped"), debug);
      return;
    }
  }
}
