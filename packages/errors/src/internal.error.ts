import { JsonRPCError } from "./json-rpc.error";

export class InternalError extends JsonRPCError {
    constructor(data?: string) {
        super({ code: -32603, message: "Internal error", data });
    }
}