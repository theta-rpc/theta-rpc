import { IErrorOptions } from './interfaces';

export class JsonRPCError extends Error {
    public code: number;
    public message: string;
    public data?: string;

    constructor(options: IErrorOptions) {
        super(options.message);
        this.code = options.code;
        this.message = options.message;
        this.data = options.data;

        /* https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work */
        Object.setPrototypeOf(this, JsonRPCError.prototype);

    }
}