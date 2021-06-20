import { ExceptionOptions } from "./interfaces";

export class JSONRPCException extends Error {
  constructor(public jsonrpcError: ExceptionOptions) {
    super(jsonrpcError.message);

    const proto = new.target.prototype;
    Object.setPrototypeOf(this, proto);
  }
}
