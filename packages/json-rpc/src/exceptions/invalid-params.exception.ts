import { RPCException } from "./rpc.exception";

export class InvalidParamsException extends RPCException {
  constructor(data?: any) {
    super({ code: -32602, message: "Invalid params", data });
  }
}
