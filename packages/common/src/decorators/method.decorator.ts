import { metadata_key } from '../constants';

export function Method(name: string): MethodDecorator {
    return (target: any, propertyKey: string | symbol) => {
        Reflect.defineMetadata(metadata_key.method, { name, key: propertyKey }, target[propertyKey]);
    }
}
