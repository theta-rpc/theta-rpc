import EventEmitter, { EventNames } from "eventemitter3";

interface OnceOptions {
  timeout: number;
}

export function once<T extends EventEmitter<any>>(
  emitter: T,
  name: T extends EventEmitter<infer X> ? EventNames<X> : never,
  options?: OnceOptions
): Promise<any[]> {
  let timer: NodeJS.Timeout;
  return new Promise((resolve, reject) => {
    if (options && options.timeout > 0) {
      timer = setTimeout(() => {
        emitter.off(name);
        reject(new Error("Timeout error"));
      }, options.timeout);
    }

    emitter.once(name, (...args: any[]) => {
      if (timer) clearTimeout(timer);
      resolve(args);
    });
  });
}

export { EventEmitter };
