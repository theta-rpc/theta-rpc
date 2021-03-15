import { PROTECTED_METADATA_KEY } from "./constants";
import { AccessorType } from "../method";

export function Protected(accessors: AccessorType[]): any {
  return (target: any, propertyKey?: string) => {
    Reflect.defineMetadata(
      PROTECTED_METADATA_KEY,
      { accessors },
      propertyKey ? target[propertyKey] : target
    );
  };
}
