import { jsonrpc } from "./jsonrpc";
import { assert, has, isArray, isObject, len } from "./utils";

export function validateV2(o: any): jsonrpc.v2.RequestObject {
  assert(has(o, "jsonrpc") && o.jsonrpc === "2.0");
  assert(has(o, "method") && typeof o.method === "string" && len(o.method) > 0);
  assert(!has(o, "params") || isObject(o.params) || isArray(o.params));
  assert(
    !has(o, "id") ||
      (typeof o.id === "number" && o.id > 0 && o.id % 1 === 0) ||
      (typeof o.id === "string" && len(o.id) > 0)
  );

  return {
    jsonrpc: o.jsonrpc,
    method: o.method,
    params: o.params,
    id: o.id,
  };
}
