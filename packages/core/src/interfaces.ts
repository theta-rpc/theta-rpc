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

    listen(port: number): void;

    close(): void;

    onListening(listener: () => any): void;
    onError(listener: (err: Error) => any): void;
    onClose(listener: () => void): void;

    up(): void;
    down(): void;
}