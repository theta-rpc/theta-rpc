import { HTTPTransportContextType } from './types';
import { Request, Response } from 'express';

export class HTTPTransportContext implements HTTPTransportContextType {
  constructor(
    private request: Request,
    private response: Response
  ) { }

  /* istanbul ignore next */
  public getRequest() {
    return this.request;
  }

  public getResponse() {
    return this.response;
  }
}
