import { HTTPContext, RequestType, ReplyType } from "./types";
import {  RawServerBase, RawServerDefault } from "fastify";

const kRequest = Symbol('http.context.request');
const kReply = Symbol('http.context.reply');

export class HTTPContextImpl<RawServer extends RawServerBase>
  implements HTTPContext<RawServer> {

  private [kRequest]: RequestType<RawServer>;
  private [kReply]: ReplyType<RawServer>;

  constructor(request: RequestType<RawServer>, reply: ReplyType<RawServer>) {
    this[kRequest] = request;
    this[kReply] = reply;
  }

  public getRequest(): RequestType<RawServer> {
    return this[kRequest];
  }

  public getReply(): ReplyType<RawServer> {
    return this[kReply];
  }
}

export function createHTTPContext<RawServer extends RawServerBase>(
  request: RequestType<RawServer>,
  reply: ReplyType<RawServer>
): HTTPContext<RawServer> {
  return new HTTPContextImpl<RawServer>(request, reply);
}

export function isHTTPContext(context: unknown): boolean {
  return context instanceof HTTPContextImpl;
}
