import { METADATA_KEY } from './constants';
import { IJsonRPCErrorObj, IJsonRPCNormalResponse, IJsonRPCErrorResponse } from './interfaces';

export namespace CommonUtils {
    export const isProcedure = (target: any): boolean => {
        return Reflect.hasMetadata(METADATA_KEY.procedure, target);
    }

    export const isMethod = (target: any): boolean => {
        return Reflect.hasMetadata(METADATA_KEY.method, target);
    }

    export const getMetadata = (metadataKey: any, target: any): any => {
        return Reflect.getMetadata(metadataKey, target);
    }

    export const buildMethodName = (method: string, namespace?: string): string => {
        return namespace ? namespace + '.' + method : method;
    }

    export const JsonRPCNormalResponseTransform = (result: any, id: number | null): IJsonRPCNormalResponse => {
        return { jsonrpc: "2.0", result, id };
    }

    export const JsonRPCErrorResponseTransform = (error: IJsonRPCErrorObj, id: number | null): IJsonRPCErrorResponse => {
        return { jsonrpc: "2.0", error, id };
    }
}
