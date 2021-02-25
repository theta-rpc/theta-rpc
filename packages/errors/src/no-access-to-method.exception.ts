import { JSONRPCException } from './json-rpc.exception';

export class NoAccessToMethodException extends JSONRPCException {
	constructor(data?: any) {
		super({ code: -32604, message: 'No access to method', data });
	}
}
