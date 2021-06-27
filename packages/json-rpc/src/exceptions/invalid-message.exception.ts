import { RPCException } from "./rpc.exception";

export class InvalidMessageException extends RPCException {
  constructor(data?: any) {
    super({ code: -32600, message: "Invalid message", data });
  }
}
