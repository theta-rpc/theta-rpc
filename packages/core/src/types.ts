import { ServerOptionsType } from './server';

export type ConstructorType<T = any> = {
  new(...args: any[]): T
}

export type ApplicationOptionsType = {
  server: ServerOptionsType
  methods: ConstructorType<any>[];
};
