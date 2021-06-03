import {
  StructuredParamsType,
  ErrorObjectType,
  RequestObjectType,
  ResponseObjectType,
} from "@theta-rpc/json-rpc";

export interface RequestObject {
  method: string;
  notify?: boolean;
  params?: StructuredParamsType;
};

export interface ResponseObject {
  error?: ErrorObjectType;
  result?: any;
};

export interface HTTPClientEvents {
  ["request"]: (request: RequestObjectType | RequestObjectType[]) => void;
  ["response"]: (response: ResponseObjectType | ResponseObjectType[]) => void;
};
