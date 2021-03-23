import { ThetaTransport } from "@theta-rpc/transport";

export type TransportsStoreType = {
  instance: ThetaTransport;
  signature: Symbol;
};
