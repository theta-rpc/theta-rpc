import { JSONRPCException } from './json-rpc.exception';

export class NoAccessToMethodException extends JSONRPCException {
	constructor(data?: string) {
		super({ code: -32604, message: 'No access to method', data });
	}
}
