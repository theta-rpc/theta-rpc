import https from 'https';
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RawServerBase,
} from "fastify";

export type HTTPTransportContextType<RawServer extends RawServerBase> = {
  getRequest(): FastifyRequest<any, RawServer>;
  getReply(): FastifyReply<RawServer>;
};

export type CommonOptionsType = {
  host?: string,
  port?: number
  path?: string,
}

export type HTTPTransportOptionsType<RawServer extends RawServerBase> = {
  attach?: FastifyInstance<RawServer>;
  https?: https.ServerOptions;
} & CommonOptionsType;
