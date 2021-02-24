import { JSONRPCException } from './json-rpc.exception';

export class InvalidRequestException extends JSONRPCException {
    constructor(data?: string) {
        super({ code: -32600, message: 'Invalid request', data });
    }
}