import { validateV2 } from './validators';

export namespace jsonrpc.v2 {
  export const validate = validateV2;

  export type ParamsType = { [key: string]: any } | any[];

  export interface RequestObject {
    jsonrpc: "2.0";
    method: string;
    params: ParamsType;
    id: number | string;
  }

  export interface NotifRequestObject extends Omit<RequestObject, "id"> {}

  export interface SuccessResponseObject {
    jsonrpc: "2.0";
    result: any;
    id: number | string;
  }

  export interface ErrorObject {
    code: number;
    message: string;
    data?: any;
  }

  export interface ErrorResponseObject {
    jsonrpc: "2.0";
    error: ErrorObject;
    id: number | string;
  }

  export function requestFactory(
    method: string,
    params: ParamsType,
    id: string | number
  ): RequestObject;
  export function requestFactory(
    method: string,
    params: ParamsType
  ): NotifRequestObject;
  export function requestFactory(
    method: string,
    params: ParamsType,
    id?: string | number
  ): RequestObject | NotifRequestObject {
    return { jsonrpc: "2.0", method, params, id };
  }

  export function successResponseFactory(
    result: any,
    id: number | string
  ): SuccessResponseObject {
    return { jsonrpc: "2.0", result, id };
  }

  export function errorResponseFactory(
    error: ErrorObject,
    id: number | string
  ): ErrorResponseObject {
    return { jsonrpc: "2.0", error, id };
  }
}
