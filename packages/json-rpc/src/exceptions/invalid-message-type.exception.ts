import { JSONRPCException } from "./json-rpc.exception";

export class InvalidMessageTypeException extends JSONRPCException {
  constructor(data?: any) {
    super({ code: -32600, message: "Invalid message type", data });
  }
}
