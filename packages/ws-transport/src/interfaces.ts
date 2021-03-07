import WebSocket from 'ws';

export interface IWsTransportOptions {
    hostname?: string,
    port: number,
    path?: string
}

export interface IWsTransportContext {
    getConnection(): WebSocket
}
