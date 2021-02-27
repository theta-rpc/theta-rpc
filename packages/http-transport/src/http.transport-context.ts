import { IHTTPTransportContext } from './interfaces';
import { Request, Response } from 'express';

export class HTTPTransportContext implements IHTTPTransportContext {
  constructor(
    private request: Request,
    private response: Response
  ) { }

  public getRequest() {
    return this.request;
  }

  public getResponse() {
    return this.response;
  }
}
