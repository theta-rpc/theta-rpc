import axios from "axios";
import createDebug from 'debug';
import {
  StructuredParamsType,
  requestFactory,
  JSONRPCException,
} from "@theta-rpc/json-rpc";
import { RequestType, ResponseType } from "./types";

const debug = createDebug('THETA-RPC:HTTP-CLIENT');

export class HTTPClient {
  constructor(private connectionURL: string) {}

  private async httpRequest(data: any) {
    debug('-> %o', data);
    const response = (await axios.post<any, any>(this.connectionURL, data, { headers: { "Content-Type": "application/json" } })).data;
    debug('<- %o', response);
    return response;
  }

  public async call<T = any>(
    method: string,
    params?: StructuredParamsType
  ): Promise<T> {
    const response = await this.httpRequest(requestFactory(method, params, 1));
    if (response.error) {
      throw new JSONRPCException(response.error);
    }
    return response.result;
  }

  public async notify(
    method: string,
    params?: StructuredParamsType
  ): Promise<void> {
    await this.httpRequest(requestFactory(method, params));
  }

  public async batch(
    requests: RequestType[]
  ): Promise<ResponseType[] | undefined> {
    const batchRequest = requests.map((request, id) =>
      requestFactory(
        request.method,
        request.params,
        request.notify ? undefined : id + 1
      )
    );
    const response = await this.httpRequest(batchRequest);
    if (Array.isArray(response)) {
      return response.map((val: any) =>
        val.error ? { error: val.error } : { result: val.result }
      );
    }
  }
}
