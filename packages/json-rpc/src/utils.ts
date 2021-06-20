export const assert = (condition: boolean, message?: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

export const has = (o: object, key: string) => o.hasOwnProperty(key);
export const isArray = (o: any) => Array.isArray(o);
export const isObject = (o: any) =>
  typeof o === "object" && o !== null && !isArray(o);
export const len = (o: string) => o.length;
