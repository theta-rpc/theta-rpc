import { JSONRPCException } from './json-rpc.exception';

export class InternalErrorException extends JSONRPCException {
  constructor(data?: any) {
    super({ code: -32603, message: 'Internal error', data });
  }
}
