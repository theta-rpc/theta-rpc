import { JsonRPCError } from './json-rpc.error';

export class InvalidParamsError extends JsonRPCError {
    constructor(data?: string) {
        super({ code: -32602, message: "Invalid params", data });
    }
}