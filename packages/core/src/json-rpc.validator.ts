import { InvalidRequestError } from '@theta-rpc/errors';
import { IProbableJsonRPCObj, IConcreteJsonRPCObj } from './interfaces';

class StaticJsonRPCValidator {
    private version = '2.0';

    private invalid(message?: string) {
        throw new InvalidRequestError(message);
    }

    public forSingle(o: IProbableJsonRPCObj): IConcreteJsonRPCObj {

        if (!('jsonrpc' in o) || 'jsonrpc' in o && o.jsonrpc !== this.version) {
            this.invalid('Incorrect jsonrpc property');
        }

        if (!('method' in o) || 'method' in o && typeof o.method !== 'string' || o.method.length === 0) {
            this.invalid('Incorrect method property');
        }

        if ('params' in o && !(o.params instanceof Object) && !Array.isArray(o.params)) {
            this.invalid('Incorrect params property');
        }

        if ('id' in o && (typeof o.id !== 'number' || o.id % 1 !== 0 || o.id < 1) && (typeof o.id !== 'string' || o.id.length === 0)) {
            this.invalid('Incorrect id property');
        }

        return {
            jsonrpc: o.jsonrpc,
            method: o.method,
            params: o.params || null,
            id: o.id || null
        }

    }

    public validate(data: IProbableJsonRPCObj): IConcreteJsonRPCObj {
        if(data instanceof Object) {
            return this.forSingle(data);
        }

        throw new InvalidRequestError();
    }
}

export const JsonRPCValidator = new StaticJsonRPCValidator();
