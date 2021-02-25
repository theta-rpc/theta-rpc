import { JSONRPCException } from './json-rpc.exception';

export class InvalidParamsException extends JSONRPCException { 
    constructor(data?: any) {
        super({ code: -32602, message: 'Invalid params', data });
    }
}