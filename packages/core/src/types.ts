import { TransportOptionsType } from "./transport";

export type ConstructorType<T = any> = {
  new(...args: any[]): T
}

export type ApplicationOptionsType<T> = {
  server: {
    transports: { [P in keyof T]: TransportOptionsType<T[P]> };
  };
  methods: ConstructorType<any>[];
};
