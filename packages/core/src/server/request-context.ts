import { RequestContextType } from "./types";
import { StructuredParamsType, RequestIDType } from '@theta-rpc/json-rpc';

export class RequestContext implements RequestContextType {
  constructor(
    public readonly id: RequestIDType | undefined,
    public readonly method: string,
    public readonly params: StructuredParamsType | undefined,
    public readonly isNotification: boolean,
    public readonly inBatchScope: boolean,
    private readonly transportContext: any
  ) { }

  public transportLayer(): any {
    return this.transportContext;
  }
}