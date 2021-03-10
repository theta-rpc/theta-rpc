import {
  SuccessResponseObjectType,
  ErrorResponseObjectType,
  ErrorObjectType,
  RequestIDType,
  RequestObjectType,
  StructuredParamsType,
} from "./types";
import { SPEC_VERSION } from './constants';

export function successResponseFactory(
  result: any,
  id: RequestIDType = null
): SuccessResponseObjectType {
  return { jsonrpc: SPEC_VERSION, result, id };
}

export function requestFactory(
  method: string,
  params?: StructuredParamsType,
  id?: RequestIDType
): RequestObjectType {
  return { jsonrpc: SPEC_VERSION, method, params, id };
}

export function errorResponseFactory(
  error: { jsonrpcError: ErrorObjectType },
  id: RequestIDType = null
): ErrorResponseObjectType {
  return { jsonrpc: SPEC_VERSION, error: error.jsonrpcError, id };
}
