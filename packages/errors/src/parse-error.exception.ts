import { JSONRPCException } from './json-rpc.exception';

export class ParseErrorException extends JSONRPCException {
    constructor(data?: string) {
        super({ code: -32700, message: 'Parse error', data });
    }
}