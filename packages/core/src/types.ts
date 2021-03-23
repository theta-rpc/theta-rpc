import { ThetaTransport } from '@theta-rpc/transport';

export type ConstructorType<T = any> = {
  new(...args: any[]): T
}

export type ApplicationOptionsType = {
  server: {
    transports: ThetaTransport[];
  };
  methods: ConstructorType<any>[];
};
