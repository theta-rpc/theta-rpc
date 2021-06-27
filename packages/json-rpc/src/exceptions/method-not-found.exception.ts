import { RPCException } from "./rpc.exception";

export class MethodNotFoundException extends RPCException {
  constructor(data?: any) {
    super({ code: -32601, message: "Method not found", data });
  }
}
