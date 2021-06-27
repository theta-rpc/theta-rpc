import { RPCException } from "./rpc.exception";

export class ParseErrorException extends RPCException {
  constructor(data?: any) {
    super({ code: -32700, message: "Parse error", data });
  }
}
