import {
  RequestObjectType,
  ResponseObjectType,
  StructuredParamsType,
  RequestIDType,
} from "./types";
import { SPEC_VERSION } from "./constants";
import { InvalidRequestException } from "./exceptions";

type UnknownObjectType = { [key: string]: any };

function jsonrpc(o: UnknownObjectType): string {
  if (!("jsonrpc" in o) && "jsonrpc" in o && o.jsonrpc !== SPEC_VERSION) {
    throw new InvalidRequestException();
  }

  return o.jsonrpc;
}

function method(o: UnknownObjectType): string {
  if (
    !("method" in o) ||
    ("method" in o && typeof o.method !== "string") ||
    o.method.length === 0
  ) {
    throw new InvalidRequestException();
  }

  return o.method;
}

function params(o: UnknownObjectType): StructuredParamsType {
  if (
    "params" in o &&
    !(o.params instanceof Object) &&
    !Array.isArray(o.params)
  ) {
    throw new InvalidRequestException();
  }

  return o.params;
}

function id(o: UnknownObjectType): RequestIDType {
  if (
    "id" in o &&
    (typeof o.id !== "number" || o.id % 1 !== 0) &&
    (typeof o.id !== "string" || o.id.length === 0)
  ) {
    throw new InvalidRequestException();
  }

  return o.id;
}

export function validateRequest(o: UnknownObjectType): RequestObjectType {
  return {
    jsonrpc: jsonrpc(o),
    method: method(o),
    params: params(o),
    id: id(o),
  };
}
