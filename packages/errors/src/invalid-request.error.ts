import { JsonRPCError } from './json-rpc.error';

export class InvalidRequestError extends JsonRPCError {
    constructor(data?: string) {
        super({ code: -32600, message: "Invalid request", data });
    }
}