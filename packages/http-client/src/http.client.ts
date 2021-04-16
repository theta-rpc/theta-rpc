import axios, { AxiosInstance } from "axios";
import createDebug from "debug";
import {
  StructuredParamsType,
  requestFactory,
  JSONRPCException
} from "@theta-rpc/json-rpc";
import { RequestType, ResponseType, HTTPClientEventsType } from "./types";
import { EventEmitter } from '@theta-rpc/events';

const debug = createDebug("THETA-RPC:HTTP-CLIENT");

export class HTTPClient extends EventEmitter<HTTPClientEventsType> {
  private client: AxiosInstance;
  private headers: any = {};

  constructor(connectionURL: string);
  constructor(axiosInstance: AxiosInstance);
  constructor(arg: string | AxiosInstance) {
    super();
    this.client =
      typeof arg === "string" ? axios.create({ baseURL: arg }) : arg;
  }

  public static attach(client: AxiosInstance): HTTPClient {
    return new HTTPClient(client);
  }

  private async sendHTTPRequest(request: any) {
    this.emit("request", request);
    debug("-> %o", request);
    const response = (
      await this.client.post("/", request, {
        headers: { "Content-Type": "application/json", ...this.headers },
      })
    ).data;
    this.emit("response", response);
    debug("<- %o", response);
    return response;
  }

  public ping(): Promise<string> {
    return this.call<string>("rpc.ping");
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
