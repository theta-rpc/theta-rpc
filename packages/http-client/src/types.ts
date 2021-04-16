import {
  StructuredParamsType,
  ErrorObjectType,
  RequestObjectType,
  ResponseObjectType,
} from "@theta-rpc/json-rpc";

export type RequestType = {
  method: string;
  notify?: boolean;
  params?: StructuredParamsType;
};

export type ResponseType = {
  error?: ErrorObjectType;
  result?: any;
};

export type HTTPClientEventsType = {
  ["request"]: (request: RequestObjectType | RequestObjectType[]) => void;
  ["response"]: (response: ResponseObjectType | ResponseObjectType[]) => void;
};
