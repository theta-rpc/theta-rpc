import { OnRequestCallbackType } from './types';

export abstract class ThetaTransport {
  constructor(public name: string) { }

  public abstract onRequest(cb: OnRequestCallbackType): any;
  public abstract reply(data: any, transportContext: any): Promise<any>;
  public abstract start(): Promise<any>;
  public abstract stop(): Promise<any>;
}
