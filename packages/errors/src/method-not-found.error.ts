import { JsonRPCError } from './json-rpc.error';

export class MethodNotfoundError extends JsonRPCError {
    constructor(data?: string) {
        super({ code: -32601, message: "Method not found", data });
    }
}