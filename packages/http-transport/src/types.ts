import https from 'https';
import http2 from 'http2';
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
  hostname?: string,
  port: number,
  path?: string,
  bodyLimit?: string
}

export type HTTPTransportOptionsType<RawServer extends RawServerBase> = {
  attach?: FastifyInstance<RawServer>;
  http?: CommonOptionsType;
  https?: CommonOptionsType & https.ServerOptions;
  http2?: CommonOptionsType & http2.ServerOptions;
  http2s?: CommonOptionsType & http2.SecureServerOptions;
};
