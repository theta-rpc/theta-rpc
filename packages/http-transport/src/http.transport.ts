import createDebug from "debug";
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
  private kDefaultPath = '/';
  private kDefaultPort = 3000;
  private isStarted = false;

  constructor(private options: HTTPTransportOptionsType<RawServer> = {}) {
    super("HTTP transport");

    let serverOptions = {};

    if(options.https) {
      serverOptions = { https: options.https }
    }

    this.server = options.attach
      ? options.attach
      : (createFastifyApplication(serverOptions) as any);

    this.listenEvents();
    this.handleErrors();
    this.registerRoute();
    this.overwriteContentTypeParser();
    this.overwriteNotFoundHandler();
  }

  private static commonOpts(options: CommonOptionsType): CommonOptionsType {
    return { host: options.host, port: options.port, path: options.path };
  }

  public static attach<T extends RawServerBase>(instance: FastifyInstance<T>) {
    return new HTTPTransport<T>({ attach: instance });
  }

  public static http(options: CommonOptionsType) {
    return new HTTPTransport({ ...this.commonOpts(options) });
  }

  public static https(options: CommonOptionsType & https.ServerOptions) {
    return new HTTPTransport<https.Server>({
      ...this.commonOpts(options),
      https: options,
    });
  }

  private listenEvents() {
    this.on("reply", (data, context) => this.reply(data, context));
    this.on("start", () => this.start());
    this.on("stop", () => this.stop());
  }

  private overwriteContentTypeParser() {
    if (!this.options.attach) {
      this.server.addContentTypeParser(
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
      this.server.setNotFoundHandler((request, reply) => {
        reply.status(404).send();
      });
    }
  }

  private registerRoute() {
    this.server.post(
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
        const context = this.createContext(request, reply);
        this.emit("message", request.body, context);
      }
    );
  }

  private handleErrors() {
    if (!this.options.attach) {
      this.server.setErrorHandler((error, request, reply) => {
        debug(error);
        reply.status(400).send();
      });
    }
  }

  private reply(data: any, context: HTTPTransportContextType<RawServer>) {
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

  private createContext(
    request: FastifyRequest<RouteGenericInterface, RawServer>,
    reply: FastifyReply<RawServer>
  ) {
    return new HTTPTransportContext(request, reply);
  }

  private start() {
    if(this.isStarted) throw new Error('The transport is already started');

    const { host, port } = this.options;
    if (!this.options.attach) {
      this.server
        .listen(port || this.kDefaultPort, host)
        .then(() => {
          this.emit("started");
          this.isStarted = true;
        })
        .catch(debug);
    }
  }

  private stop() {
    if(!this.isStarted) throw new Error("The transport is already stopped")

    if (!this.options.attach) {
      this.server.close().then(() => {
        this.emit("stopped");
        this.isStarted = false;
      }, debug);
      return;
    }
  }
}
