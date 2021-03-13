import { JSONRPCException } from './json-rpc.exception';

export class BadTransportDataException extends JSONRPCException {
  constructor(data?: any) {
    super({ code: -32600, message: 'Bad transport data', data });
  }
}
