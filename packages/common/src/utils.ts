import { metadata_key } from './constants';
import {
    IJsonRPCErrorObj,
    IJsonRPCSuccessResponse,
    IJsonRPCErrorResponse
} from './interfaces';

export namespace utils {
    export const isProcedure = (target: any): boolean => {
        return Reflect.hasMetadata(metadata_key.procedure, target);
    }

    export const isMethod = (target: any): boolean => {
        return Reflect.hasMetadata(metadata_key.method, target);
    }

    export const getMetadata = (metadataKey: any, target: any): any => {
        return Reflect.getMetadata(metadataKey, target);
    }

    export const buildMethodName = (method: string, namespace?: string): string => {
        return namespace ? namespace + '.' + method : method;
    }

    export const stringify = (obj: Object): string => {
        return JSON.stringify(obj);
    }

    export const parse = (data: string): Object => {
        return JSON.parse(data);
    }


    export const arraySameValue = (array: any[], el: any): boolean => {
        return array.every((value) => value === el);
    }

    export const sanitizeResponse = (response: any, el: any) => {

        if(Array.isArray(response)) {
            const filtered = response.filter((rpcResponse) => rpcResponse !== el);

            return arraySameValue(filtered, el) ? null : filtered
        }

        return response == el ? null : response;
    }

    export const SuccessResponseTransform = (result: any, id: number | null): IJsonRPCSuccessResponse => {
        return { jsonrpc: "2.0", result, id };
    }

    export const ErrorResponseTransform = (error: IJsonRPCErrorObj, id: number | null): IJsonRPCErrorResponse => {
        return { jsonrpc: "2.0", error: {
            code: error.code,
            message: error.message,
            data: error.data
        }, id };
    }
}
