export type StructuredParamsType = { [key: string]: any } | any[];
export type RequestIDType = number | string | null;

export type RequestObjectType<TParams = StructuredParamsType> = {
  jsonrpc: string,
  method: string,
  params?: TParams,
  id?: RequestIDType
}

export type SuccessResponseObjectType<TResult = any> = {
  jsonrpc: string,
  result: TResult,
  id?: RequestIDType
}

export type ErrorResponseObjectType = {
  jsonrpc: string,
  error: ErrorObjectType,
  id?: RequestIDType
}

export type ResponseObjectType = SuccessResponseObjectType | ErrorResponseObjectType;

export type ErrorObjectType = {
  code: number,
  message: string,
  data?: any
}
