import { ExceptionOptionsType } from './types';

export class JSONRPCException extends Error {
  constructor(public jsonrpcError: ExceptionOptionsType) {
    super(jsonrpcError.message);

    const proto = new.target.prototype;
    Object.setPrototypeOf(this, proto);
  }
}
