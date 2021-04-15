import { ThetaTransport } from '@theta-rpc/transport';
import {
  RequestObjectType,
  StructuredParamsType,
  requestFactory,
  RequestIDType,
} from "@theta-rpc/json-rpc";
import { IFakeTransportOptions  } from './interfaces';

export class FakeTransport extends ThetaTransport {
  constructor(private options?: IFakeTransportOptions) {
    super("Fake transport");
  }

  public send<T>(
    method: string,
    params?: StructuredParamsType,
    id?: RequestIDType,
    transportContext?: any
  ): Promise<T>;
  public send<T>(
    requestObject: RequestObjectType,
    transportContext?: any
  ): Promise<T>;
  public send<T>(arg1: any, arg2?: any, arg3?: any, arg4?: any): Promise<T> {
    let rpcRequest =
      typeof arg1 === "string" ? requestFactory(arg1, arg2, arg3) : arg1;
    this.emit("message", rpcRequest, typeof arg1 === "string" ? arg4 : arg2);
    return this.toPromise("reply", this.options?.timeout);
  }
}
