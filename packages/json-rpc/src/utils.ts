import {
  SuccessResponseObjectType,
  ErrorResponseObjectType,
  ErrorObjectType,
  RequestIDType,
  RequestObjectType,
  StructuredParamsType,
} from "./types";

export function successResponseFactory(
  result: any,
  id: RequestIDType = null
): SuccessResponseObjectType {
  return { jsonrpc: "2.0", result, id };
}

export function requestFactory(
  method: string,
  params?: StructuredParamsType,
  id?: RequestIDType
): RequestObjectType {
  return { jsonrpc: "2.0", method, params, id };
}

export function errorResponseFactory(
  error: { jsonrpcError: ErrorObjectType },
  id: RequestIDType = null
): ErrorResponseObjectType {
  return { jsonrpc: "2.0", error: error.jsonrpcError, id };
}
