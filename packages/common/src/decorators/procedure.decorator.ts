import { metadata_key } from "../constants";

export function Procedure(namespace?: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(metadata_key.procedure, { target, namespace }, target);
    }
}