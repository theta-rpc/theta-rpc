import { RequestIDType, StructuredParamsType } from '@theta-rpc/json-rpc';
import { ThetaTransport } from '@theta-rpc/transport';

export type RequestContextType<TParams = StructuredParamsType> = {
  readonly id: RequestIDType | undefined;
  readonly method: string;
  readonly params: TParams | undefined;
  readonly isNotification: boolean;
  readonly inBatchScope: boolean;

  transportLayer<T = any>(): T | undefined;
}

export type ServerOptionsType = {
  transports: ThetaTransport[]
}
