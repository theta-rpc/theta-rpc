import { ClassType } from '@theta-rpc/common';
import { EventEmitter } from "events";

export interface IMethodMetadata {
    handler: (...args: any[]) => any
}

export interface ITransport extends EventEmitter {
    readonly name: string,

    reply(expected: any, data: any): void;
    start(): void;
    stop(): void;
}

export interface IServerOptions<ITransportOptions> {
    transport: ClassType<any>,
    transportOptions: ITransportOptions
}

export interface IContext<TParams = any> {
    id: number | null
    method: string,
    params: TParams,
    inBatchScope: boolean,
    isNotification: boolean,
    rpcBody: IConcreteJsonRPCObj
}

export interface IThetaRPCFactoryOptions<TransportOptions> {
    server: IServerOptions<TransportOptions>,
    procedures?: ClassType<unknown>[]
}

export interface IProbableJsonRPCObj {
    [key: string]: any
}

export interface IConcreteJsonRPCObj {
    jsonrpc: string;
    method: string;
    params?: any;
    id?: any
}
