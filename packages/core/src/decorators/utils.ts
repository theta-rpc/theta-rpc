import { PROTECTED_METADATA_KEY } from "./constants";
import { MetadataType } from "./types";

export function isProtected(value: any): boolean {
  return Reflect.hasMetadata(PROTECTED_METADATA_KEY, value);
}

export function getMetadata(value: any): MetadataType {
  return Reflect.getMetadata(PROTECTED_METADATA_KEY, value);
}
