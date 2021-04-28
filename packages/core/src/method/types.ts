import { RequestContextType } from '../server';

export type AccessorType = (context: RequestContextType) => Promise<boolean> | boolean;
export type HandlerType = (context: RequestContextType<any>) => any;

export type MethodObjectType = {
  method: string,
  handler: (context: RequestContextType) => any,
  accessors: AccessorType[]
}
