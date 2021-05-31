import { RequestIDType, StructuredParamsType } from '@theta-rpc/json-rpc';
import { ThetaTransport } from '@theta-rpc/transport';

export interface RequestContext<TParams = StructuredParamsType> {
  readonly id: RequestIDType | undefined;
  readonly method: string;
  readonly params: TParams | undefined;
  readonly isNotification: boolean;
  readonly inBatchScope: boolean;

  transportContext<T = any>(): T | undefined;
}

export type ServerOptions = {
  transports: ThetaTransport[]
}
