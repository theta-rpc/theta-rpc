import createDebug from "debug";
import https from "https";
import http2 from 'http2';
import { ThetaTransport } from "@theta-rpc/transport";
import { createHTTPContext } from "./http.context";
import createFastifyApplication, {
  FastifyInstance,
  RawServerBase
} from "fastify";
import {
  HTTPTransportOptions,
  HTTPContext,
  CommonOptions,
} from "./types";

const debug = createDebug("THETA-RPC:HTTP-TRANSPORT");

export class HTTPTransport<
  RawServer extends RawServerBase = RawServerBase
> extends ThetaTransport {

  private readonly kServer: FastifyInstance<RawServer>;
  private readonly kDefaultPath = "/";
  private readonly kDefaultPort = 3000;
  private isRunning = false;

  constructor(private options: HTTPTransportOptions<RawServer>) {
    super("HTTP transport");

    this.kServer = options.attach
      ? options.attach
      : (createFastifyApplication(options.fastifyOptions) as any);

    this.listenEvents();
    this.handleErrors();
    this.registerRoute();
    this.overwriteContentTypeParser();
    this.overwriteNotFoundHandler();
  }

  public static http(options: CommonOptions): HTTPTransport {
    return new HTTPTransport(options);
  }

  public static https(
    options: CommonOptions & https.ServerOptions
  ): HTTPTransport<https.Server> {
    const { hostname, port, path, ...httpsOptions } = options;
    return new HTTPTransport<https.Server>({
      hostname,
      port,
      path,
      fastifyOptions: { https: httpsOptions },
    });
  }

  public static attach<T extends RawServerBase>(
    instance: FastifyInstance<T>,
    path?: string
  ): HTTPTransport<T> {
    return new HTTPTransport<T>({ attach: instance, path });
  }

  private listenEvents() {
    this.on("reply", (data, context) => this.reply(data, context));
    this.on("start", () => this.start());
    this.on("stop", () => this.stop());
  }

  private overwriteContentTypeParser() {
    if (!this.options.attach) {
      this.kServer.addContentTypeParser(
        "application/json",
        { parseAs: "string" },
        (request, payload, done) => {
          done(null, payload);
        }
      );
    }
  }

  private overwriteNotFoundHandler() {
    if (!this.options.attach) {
      this.kServer.setNotFoundHandler((request, reply) => {
        reply.status(404).send();
      });
    }
  }

  private registerRoute() {
    this.kServer.post(
      this.options.path || this.kDefaultPath,
      {
        preHandler: (request, reply, done) => {
          if (request.headers["content-type"] !== "application/json") {
            reply.status(415).send();
            return;
          }
          done();
        },
      },
      (request, reply) => {
        const context = createHTTPContext(request, reply);
        this.emit("message", request.body, context);
      }
    );
  }

  private handleErrors() {
    if (!this.options.attach) {
      this.kServer.setErrorHandler((error, request, reply) => {
        debug(error);
        reply.status(400).send();
      });
    }
  }

  private reply(data: unknown, context: HTTPContext<RawServer>) {
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

  private start() {
    if (this.isRunning) {
      debug("The transport is already running");
      return;
    }

    const { hostname, port } = this.options;
    if (!this.options.attach) {
      this.kServer
        .listen(port || this.kDefaultPort, hostname)
        .then(() => {
          this.emit("started");
          this.isRunning = true;
        })
        .catch(debug);
    }
  }

  private stop() {
    if (!this.isRunning) {
      debug("The transport is not running");
      return;
    }

    if (!this.options.attach) {
      this.kServer.close().then(() => {
        this.emit("stopped");
        this.isRunning = false;
      }, debug);
    }
  }
}
