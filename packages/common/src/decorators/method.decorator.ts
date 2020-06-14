import { METADATA_KEY } from '../constants';

export function Method(name: string): MethodDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const method = target[propertyKey];
        Reflect.defineMetadata(METADATA_KEY.method, { name, ref: method }, method);
    }
}
