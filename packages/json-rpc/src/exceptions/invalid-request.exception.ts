import { RPCException } from "./rpc.exception";

export class InvalidRequestException extends RPCException {
  constructor(data?: any) {
    super({ code: -32600, message: "Invalid request", data });
  }
}
