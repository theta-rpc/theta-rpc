import { METADATA_KEY } from '../constants';

export function Method(name: string): MethodDecorator {
    return (target: any, propertyKey: string | symbol) => {
        Reflect.defineMetadata(METADATA_KEY.method, { name, target, key: propertyKey }, target);
    }
}