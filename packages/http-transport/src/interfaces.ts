import { CorsOptions } from 'cors';

export interface IHttpTransportOptions {
    hostname?: string;
    port: number;
    endpoint?: string;
    cors?: CorsOptions
}
