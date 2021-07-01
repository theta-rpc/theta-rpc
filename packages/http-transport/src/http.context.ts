import { RawServerBase, RawServerDefault } from "fastify";
import { HTTPContext, RequestType, ReplyType } from "./types";

const requestSymb = Symbol('http.context.request');
const replySymb = Symbol('http.context.reply');

export class HTTPContextImpl<RawServer extends RawServerBase>
  implements HTTPContext<RawServer> {

  private [requestSymb]: RequestType<RawServer>;
  private [replySymb]: ReplyType<RawServer>;

  constructor(request: RequestType<RawServer>, reply: ReplyType<RawServer>) {
    this[requestSymb] = request;
    this[replySymb] = reply;
  }

  public getRequest(): RequestType<RawServer> {
    return this[requestSymb];
  }

  public getReply(): ReplyType<RawServer> {
    return this[replySymb];
  }
}

export function createHTTPContext<RawServer extends RawServerBase>(
  request: RequestType<RawServer>,
  reply: ReplyType<RawServer>
): HTTPContext<RawServer> {
  return new HTTPContextImpl<RawServer>(request, reply);
}

export function isHTTPContext(context: unknown): context is HTTPContext {
  return context instanceof HTTPContextImpl;
}
