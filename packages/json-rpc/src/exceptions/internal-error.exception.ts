import { RPCException } from "./rpc.exception";

export class InternalErrorException extends RPCException {
  constructor(data?: any) {
    super({ code: -32603, message: "Internal error", data });
  }
}
