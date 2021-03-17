import { ThetaTransport } from "@theta-rpc/transport";
import { ConstructorType } from "../types";

export type TransportsStoreType = {
  instance: ThetaTransport;
  signature: Symbol;
};

export type TransportOptionsType<T> = {
  transport: ConstructorType<ThetaTransport>;
  options: T;
};
