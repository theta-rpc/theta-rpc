import createDebug from "debug";
import {
  ParseErrorException,
  InvalidRequestException,
  BadTransportDataException,
  errorResponseFactory,
  RequestObjectType,
  ResponseObjectType,
  validateRequest
} from "@theta-rpc/json-rpc";
import { Composer } from "../transport/composer";
import { Executor } from "../method/executor";
import { RequestContextImpl } from "./request-context";
import { TransportContext } from "../transport/transport-context";
import { RequestContext, ServerOptions } from "./types";

const debug = createDebug("THETA-RPC");

type InternalResponseType =
  | (ResponseObjectType | undefined)
  | (ResponseObjectType | undefined)[];

export class Server {
  private composer = new Composer();

  constructor(private executor: Executor, options: ServerOptions) {
    this.composer.load(options.transports);
    this.composer.onRequest((data, transportContext) =>
      this.processRequest(data, transportContext)
    );
  }

  private async processRequest(
    request: any,
    transportContext: TransportContext
  ): Promise<void> {
    try {
      const data = this.prepare(request);
      let response: InternalResponseType;

      if (Array.isArray(data)) {
        if (!data.length) throw new InvalidRequestException();
        response = await Promise.all(
          data.map((value) => this.callMethod(value, transportContext, true))
        );
      } else {
        response = await this.callMethod(data, transportContext, false);
      }
      this.respond(response, transportContext);
    } catch (e) {
      this.respond(errorResponseFactory(e), transportContext);
    }
  }

  private sanitizeResponse(
    response: InternalResponseType
  ): InternalResponseType {
    if (Array.isArray(response)) {
      const filtered = response.filter((val) => val !== undefined);
      return filtered.length ? filtered : undefined;
    }

    return response;
  }

  private prepare(data: any): any {
    if (Buffer.isBuffer(data)) {
      return this.tryParseJSON(data.toString("utf-8"));
    } else if (typeof data === "string") {
      return this.tryParseJSON(data);
    } else if (typeof data === "object" && data !== null) {
      return data;
    }

    throw new BadTransportDataException();
  }

  private respond(
    response: InternalResponseType,
    transportContext: TransportContext
  ): void {
    const sanitizedResponse = this.sanitizeResponse(response);

    if (sanitizedResponse) {
      this.composer.respond(sanitizedResponse, transportContext);
      return;
    }

    this.composer.respond(undefined, transportContext);
  }

  private async callMethod(
    requestObject: any,
    transportContext: TransportContext,
    inBatchScope: boolean
  ): Promise<ResponseObjectType | undefined> {
    try {
      const validatedObject = validateRequest(requestObject);
      const requestContext = this.createRequestContext(
        validatedObject,
        inBatchScope,
        transportContext
      );
      const response = await this.executor.execute(
        validatedObject.method,
        requestContext
      );
      return requestContext.isNotification ? undefined : response;
    } catch {
      return errorResponseFactory(new InvalidRequestException());
    }
  }

  private tryParseJSON(data: any): unknown {
    try {
      return JSON.parse(data);
    } catch (e) {
      throw new ParseErrorException();
    }
  }

  private createRequestContext(
    requestObject: RequestObjectType,
    inBatchScope: boolean,
    transportContext: TransportContext
  ): RequestContext {
    return new RequestContextImpl(
      requestObject.id,
      requestObject.method,
      requestObject.params,
      !!!requestObject.id,
      inBatchScope,
      transportContext.context
    );
  }

  public start(): Promise<any> {
    return this.composer.start();
  }

  public shutdown(): Promise<any> {
    return this.composer.stop();
  }
}
