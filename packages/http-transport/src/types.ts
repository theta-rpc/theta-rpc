import {
  FastifyHttp2Options,
  FastifyHttp2SecureOptions,
  FastifyHttpsOptions,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
  RawServerBase,
  RawServerDefault
} from "fastify";
import { RouteGenericInterface } from 'fastify/types/route';

export type RequestType<RawServer extends RawServerBase> = FastifyRequest<RouteGenericInterface, RawServer>;
export type ReplyType<RawServer extends RawServerBase> = FastifyReply<RawServer>;

export interface HTTPContext<RawServer extends RawServerBase = RawServerDefault> {
  getRequest(): RequestType<RawServer>;
  getReply(): ReplyType<RawServer>;
}

export interface CommonOptions {
  hostname?: string,
  port?: number,
  path?: string
}

type FastifyOptionsType =
  | FastifyServerOptions
  | FastifyHttpsOptions<any>
  | FastifyHttp2Options<any>
  | FastifyHttp2SecureOptions<any>;

export interface HTTPTransportOptions<RawServer extends RawServerBase>
  extends CommonOptions {
  fastifyOptions?: FastifyOptionsType;
  attach?: FastifyInstance<RawServer>;
};
