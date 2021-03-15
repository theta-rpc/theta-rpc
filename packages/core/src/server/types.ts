import { RequestIDType, StructuredParamsType } from '@theta-rpc/json-rpc';

export type RequestContextType<TParams = StructuredParamsType> = {
  readonly id: RequestIDType | undefined;
  readonly method: string;
  readonly params: TParams | undefined;
  readonly isNotification: boolean;
  readonly inBatchScope: boolean;

  transportLayer<T = any>(): T | undefined;
}
