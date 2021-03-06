import { StructuredParamsType, ErrorObjectType } from '@theta-rpc/json-rpc';

export type RequestType = {
  method: string,
  notify?: boolean,
  params?: StructuredParamsType
}

export type ResponseType = {
  error?: ErrorObjectType,
  result?: any
}
