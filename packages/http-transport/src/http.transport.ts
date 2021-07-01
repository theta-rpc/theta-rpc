import createDebug from "debug";
import https from "https";
import http2 from 'http2';
import { Transport } from "@theta-rpc/transport";
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

const debug = createDebug("theta-rpc:http-transport");

export class HTTPTransport<
  RawServer extends RawServerBase = RawServerBase
> extends Transport {

  private readonly server: FastifyInstance<RawServer>;
  private readonly defaultPath = "/";
  private readonly defaultPort = 3000;
  private isRunning = false;

  constructor(private options: HTTPTransportOptions<RawServer>) {
    super("HTTP transport");

    this.server = options.attach
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

  // Should we rename the method to something like "http2" ?
  public static h2c(
    options: CommonOptions & http2.ServerOptions
  ): HTTPTransport<http2.Http2Server> {
    const { hostname, port, path } = options;
    return new HTTPTransport<http2.Http2Server>({
      hostname,
      port,
      path,
      fastifyOptions: { http2: true },
    });
  }

  public static h2(
    options: CommonOptions & http2.SecureServerOptions
  ): HTTPTransport<http2.Http2SecureServer> {
    const { hostname, port, path, ...httpsOptions } = options;
    return new HTTPTransport<http2.Http2SecureServer>({
      hostname,
      port,
      path,
      fastifyOptions: { http2: true, https: httpsOptions },
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
    if(this.options.attach) return;

    this.server.addContentTypeParser(
      "application/json",
      { parseAs: "string" },
      (request, payload, done) => {
        done(null, payload);
      }
    );
  }

  private overwriteNotFoundHandler() {
    if(this.options.attach) return;

    this.server.setNotFoundHandler((request, reply) => {
      reply.status(404).send();
    });
  }

  private registerRoute() {
    this.server.post(
      this.options.path || this.defaultPath,
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
        this.emit("message", (request.body as string), context);
      }
    );
  }

  private handleErrors() {
    if(this.options.attach) return;

    this.server.setErrorHandler((error, request, reply) => {
      debug(error);
      reply.status(400).send();
    });
  }

  private reply(message: string | null, context: unknown) {
    const reply = (context as HTTPContext<RawServer>).getReply();
    if(reply.sent) return;

    if (!message) {
      reply.status(204).send();
      return;
    }

    reply.header("Content-Type", "application/json");
    reply.send(message);
  }

  private start() {
    if(this.isRunning || this.options.attach) return;

    const { hostname, port } = this.options;
    this.server
      .listen(port || this.defaultPort, hostname)
      .then(() => {
        this.emit("started");
        this.isRunning = true;
      })
      .catch(debug);
  }

  private stop() {
    if(!this.isRunning || this.options.attach) return;

    this.server.close().then(() => {
      this.emit("stopped");
      this.isRunning = false;
    }, debug);
  }
}
