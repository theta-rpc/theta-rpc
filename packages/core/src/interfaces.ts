import { Type } from '@theta-rpc/common';
import { JsonRPCServer } from './server';

export interface IJsonRPCFactoryOptions {
    server: JsonRPCServer,
    procedures?: Type<any>[]
}

export interface IJsonRPCServerOptions {
    hostname?: string,
    port: number
}

export interface ITransport {
    readonly name: string;
    start(): void;

    onStart(listener: () => any): void;
    onData(listener: (expected: any, data: any) => any ): void;
    onError(listener: (...args: any[]) => any): void;
    onStop(listener: () => void): void;

    reply(expected: any, data: any): void;
}

export interface ITransportGeneralOptions {
    hostname?: string;
    port: number
}
