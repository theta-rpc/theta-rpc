import { RPCException } from "./rpc.exception";

export class AccessDeniedException extends RPCException {
  constructor(data?: any) {
    super({ code: -32604, message: "Access denied", data });
  }
}
