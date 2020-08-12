import { CONSTANTS } from '../constants';

export function Method(name: string): MethodDecorator {
    return (target: any, propertyKey: string | symbol) => {
        Reflect.defineMetadata(CONSTANTS.METHOD, { name, key: propertyKey }, target[propertyKey]);
    }
}
