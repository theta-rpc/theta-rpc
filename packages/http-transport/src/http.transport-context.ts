import { HTTPTransportContextType } from "./types";
import { FastifyRequest, FastifyReply, RawServerBase } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";

export class HTTPTransportContext<RawServer extends RawServerBase>
  implements HTTPTransportContextType<RawServer> {
  constructor(
    private request: FastifyRequest<RouteGenericInterface, RawServer>,
    private reply: FastifyReply<RawServer>
  ) {}

  public getRequest() {
    return this.request;
  }

  public getReply() {
    return this.reply;
  }
}
