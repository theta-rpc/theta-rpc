import axios from 'axios';
import { StructuredParamsType, requestFactory, JSONRPCException } from '@theta-rpc/json-rpc';
import { RequestType, ResponseType } from './types';

export class HTTPClient {
  constructor(private connectionURL: string) { }

  private async httpRequest(data: any) {
    return (await axios.post<any, any>(this.connectionURL, data, { headers: { 'Content-Type': 'application/json' }})).data;
  }

  public async call<T = any>(method: string, params?: StructuredParamsType): Promise<T> {
    const response = await this.httpRequest(requestFactory(method, params, 1));
    if(response.error) {
      throw new JSONRPCException(response.error)
    }
    return response.result;
  }

  public async notify(method: string, params?: StructuredParamsType): Promise<void> {
    await this.httpRequest(requestFactory(method, params));
  }

  public async batch(requests: RequestType[]): Promise<ResponseType[]> {
    const batchRequest = requests.map((request, id) => requestFactory(request.method, request.params, id + 1));
    const response = await this.httpRequest(batchRequest);
    return response.map((val: any) => val.error ? { error: val.error } : { result: val.result });
  }
}
