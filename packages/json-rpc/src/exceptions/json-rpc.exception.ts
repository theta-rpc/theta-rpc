import { ExceptionOptionsType } from './types';

export class JSONRPCException extends Error {
  constructor(public jsonrpcError: ExceptionOptionsType) {
    super(jsonrpcError.message);

    Object.setPrototypeOf(this, JSONRPCException.prototype);
  }
}
