import { METADATA_KEY } from "../constants";

export function Procedure(namespace?: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(METADATA_KEY.procedure, { target, namespace }, target);
    }
}