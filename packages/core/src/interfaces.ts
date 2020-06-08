export interface IJsonRPCFactoryOptions {
    server: any,
    procedures: any[]
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
