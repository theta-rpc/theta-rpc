import { JSONRPCException } from './json-rpc.exception';

export class MethodNotFoundException extends JSONRPCException {
    constructor(data?: string) {
        super({ code: -32601, message: 'Method not found', data });
    }
}