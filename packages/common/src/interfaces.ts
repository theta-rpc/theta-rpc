
export interface Type<T> {
    new(...args: any[]): T
}

export interface IJsonRPCErrorObj {
    code: number,
    message: string,
    data?: string
}

export interface IJsonRPCNormalResponse {
    jsonrpc: string,
    result: any,
    id: number | null
}

export interface IJsonRPCErrorResponse {
    jsonrpc: string,
    error: IJsonRPCErrorObj,
    id: number | null
}
