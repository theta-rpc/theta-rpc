import axios, { AxiosInstance } from "axios";
import createDebug from "debug";
import {
  StructuredParamsType,
  requestFactory,
  JSONRPCException,
} from "@theta-rpc/json-rpc";
import { RequestType, ResponseType } from "./types";

const debug = createDebug("THETA-RPC:HTTP-CLIENT");

export class HTTPClient {
  private client: AxiosInstance;
  private headers: any = {};

  constructor(connectionURL: string);
  constructor(axiosInstance: AxiosInstance);
  constructor(arg: string | AxiosInstance) {
    this.client =
      typeof arg === "string" ? axios.create({ baseURL: arg }) : arg;
  }

  private async sendHTTPRequest(request: any) {
    debug("-> %o", request);
    const response = (
      await this.client.post("/", request, {
        headers: { "Content-Type": "application/json", ...this.headers },
      })
    ).data;
    debug("<- %o", response);
    return response;
  }

  public setHeader(key: string, value: string): HTTPClient {
    this.headers[key] = value;
    return this;
  }

  public proxify(): any {
    const handler: ProxyHandler<any> = {
      get: (target, propKey) => {
        if (typeof propKey !== "string")
          throw new Error("Method name must be a string");
        return (...args: any[]) => {
          return this.call(propKey, args);
        };
      },
    };

    return new Proxy({}, handler);
  }

  public async call<T = any>(
    method: string,
    params?: StructuredParamsType
  ): Promise<T> {
    const response = await this.sendHTTPRequest(
      requestFactory(method, params, 1)
    );
    if (response.error) {
      throw new JSONRPCException(response.error);
    }
    return response.result;
  }

  public async notify(
    method: string,
    params?: StructuredParamsType
  ): Promise<void> {
    await this.sendHTTPRequest(requestFactory(method, params));
  }

  public async batch(
    requests: RequestType[]
  ): Promise<ResponseType[] | undefined> {
    const batchRequest = requests.map(({ method, params, notify }, id) =>
      requestFactory(method, params, notify ? undefined : id + 1)
    );
    const response = await this.sendHTTPRequest(batchRequest);
    if (Array.isArray(response)) {
      return response.map(({ error, result }) =>
        error ? { error } : { result }
      );
    }
  }
}
