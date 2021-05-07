import { HTTPTransportContextType } from './types';
import { FastifyRequest, FastifyReply, RawServerBase } from 'fastify';

export class HTTPTransportContext<RawServer extends RawServerBase>
  implements HTTPTransportContextType<RawServer> {
  constructor(
    private request: FastifyRequest<any, RawServer>,
    private reply: FastifyReply<RawServer>
  ) {}

  /* istanbul ignore next */
  public getRequest() {
    return this.request;
  }

  public getReply() {
    return this.reply;
  }
}
