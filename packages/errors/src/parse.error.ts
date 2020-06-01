import { JsonRPCError } from "./json-rpc.error";

export class ParseError extends JsonRPCError {
    constructor(data?: string) {
        super({ code: -32700, message: "Parse error", data });
    }
}