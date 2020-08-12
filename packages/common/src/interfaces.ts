import { EventEmitter } from 'events';

export type ClassType<T> = {
    new(...args: any[]): T;
}

export interface ITransport extends EventEmitter {
  readonly name: string
}

export interface IJsonRPCErrorObj {
    code: number,
    message: string,
    data?: string
}

export interface IJsonRPCSuccessResponse {
    jsonrpc: string,
    result: any,
    id: number | null
}

export interface IJsonRPCErrorResponse {
    jsonrpc: string,
    error: IJsonRPCErrorObj,
    id: number | null
}
