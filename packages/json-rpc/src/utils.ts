import { RPCException } from "./exceptions";
import {
  ErrorResponseMessage,
  Id,
  Message,
  NotifMessage,
  Params,
  ResponseId,
  ResponseMessage,
} from "./interfaces";

export function createMessage(method: string, params: Params, id: Id): Message;
export function createMessage(method: string, params: Params): NotifMessage;
export function createMessage(
  method: string,
  params: Params,
  id?: Id
): Message | NotifMessage {
  return { jsonrpc: "2.0", method, params, id };
}

export function createResponseMessage(
  result: unknown,
  id: ResponseId
): ResponseMessage;
export function createResponseMessage(
  error: RPCException,
  id: ResponseId
): ErrorResponseMessage;
export function createResponseMessage(
  resultOrError: any,
  id: ResponseId
): ResponseMessage | ErrorResponseMessage {
  if (resultOrError instanceof RPCException) {
    return { jsonrpc: "2.0", error: resultOrError.jsonrpcError, id };
  }
  return { jsonrpc: "2.0", result: resultOrError, id };
}

const has = (o: object, key: string) => o.hasOwnProperty(key);
const len = (o: string) => o.length;
const str = (o: any) => typeof o === "string";
const arr = (o: any) => Array.isArray(o);
const obj = (o: any) => typeof o === "object" && o !== null && !arr(o);
const num = (o: any) => typeof o === "number";

export function checkMessage(o: any): o is Message {
  if (!has(o, "jsonrpc") || o.jsonrpc !== "2.0") {
    return false;
  }

  if (!has(o, "method") || !str(o.method) || len(o.method) < 1) {
    return false;
  }

  if (has(o, "params") && !arr(o.params) && !obj(o.params)) {
    return false;
  }

  if (
    has(o, "id") &&
    ((num(o.id) && o.id % 1 !== 0) || (str(o.id) && len(o.id) < 1))
  ) {
    return false;
  }

  return true;
}
