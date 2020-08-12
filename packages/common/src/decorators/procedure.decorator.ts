import { CONSTANTS } from "../constants";

export function Procedure(namespace?: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(CONSTANTS.PROCEDURE, { target, namespace }, target);
    }
}
