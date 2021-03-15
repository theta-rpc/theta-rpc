import createDebug from "debug";
import {
  JSONRPCException,
  NoAccessToMethodException,
  MethodNotFoundException,
  InternalErrorException,
  ResponseObjectType,
  successResponseFactory,
  errorResponseFactory,
} from "@theta-rpc/json-rpc";
import { Container } from "./container";
import { RequestContextType } from "../server/types";
import { AccessorType } from "./types";

const errorDebug = createDebug("THETA-RPC:ERROR");

export class Executor {
  constructor(private container: Container) {}

  private async canAccess(
    accessors: AccessorType[],
    requestContext: RequestContextType
  ): Promise<void> {
    for (const accessor of accessors) {
      if (!(await accessor(requestContext))) {
        throw new NoAccessToMethodException();
      }
    }
  }

  private tryGetMethod(method: string) {
    if (this.container.exists(method)) {
      return this.container.get(method)!;
    }

    throw new MethodNotFoundException();
  }

  private isTrustedException(e: Error) {
    return e instanceof JSONRPCException;
  }

  public async execute(
    methodName: string,
    requestContext: RequestContextType
  ): Promise<ResponseObjectType> {
    try {
      const method = this.tryGetMethod(methodName);
      await this.canAccess(method.accessors, requestContext);
      const rawResult = await method.handler(requestContext);
      return successResponseFactory(
        rawResult === undefined ? "" : rawResult,
        requestContext.id
      );
    } catch (e) {
      if (this.isTrustedException(e)) {
        return errorResponseFactory(e, requestContext.id);
      }
      errorDebug(e);
      return errorResponseFactory(
        new InternalErrorException(),
        requestContext.id
      );
    }
  }
}
