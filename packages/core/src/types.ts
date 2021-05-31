import { AccessorType, HandlerType } from './method';

export interface Application {
  expose(method: string, handler: HandlerType): boolean;
  expose(method: string, accessors: AccessorType[], handler: HandlerType): boolean;

  start(callback?: (error?: Error) => void): void;
  stop(callback?: (error?: Error) => void): void;
}
