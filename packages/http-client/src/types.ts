import { StructuredParamsType, ErrorObjectType } from '@theta-rpc/json-rpc';

export type RequestType = {
  method: string,
  params?: StructuredParamsType,
}

export type ResponseType = {
  error?: ErrorObjectType,
  result?: any
}
