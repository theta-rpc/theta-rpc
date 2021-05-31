import { RequestContext } from '../server';

export type AccessorType = (context: RequestContext) => Promise<boolean> | boolean;
export type HandlerType = (context: RequestContext) => unknown;

export type MethodObjectType = {
  method: string,
  handler: (context: RequestContext) => unknown,
  accessors: AccessorType[]
}
