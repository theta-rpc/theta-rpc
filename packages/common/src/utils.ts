import { METADATA_KEY } from './constants';

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
}