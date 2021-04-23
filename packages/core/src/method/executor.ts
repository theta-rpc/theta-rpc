import createDebug from "debug";
import {
  JSONRPCException,
  NoAccessToMethodException,
  MethodNotFoundException,
  InternalErrorException,
  successResponseFactory,
  errorResponseFactory,
} from "@theta-rpc/json-rpc";
import { Container } from "./container";
import { RequestContextType } from "../server/types";
import { AccessorType } from "./types";

const errorDebug = createDebug("THETA-RPC:ERROR");

export class Executor {
  constructor(private container: Container) {}

  private async executeEachAccessor(
    accessors: AccessorType[],
    requestContext: RequestContextType
  ): Promise<void> {
    for (const accessor of accessors) {
      if (!(await accessor(requestContext))) {
        throw new NoAccessToMethodException();
      }
    }
  }

  public tryGetMethod(name: string) {
    if (this.container.exists(name)) {
      return this.container.get(name)!;
    }

    throw new MethodNotFoundException();
  }

  public async execute(
    name: string,
    requestContext: RequestContextType
  ): Promise<any> {
    try {
      const method = this.tryGetMethod(name);
      await this.executeEachAccessor(method.accessors, requestContext);
      const rawResult = await method.handler(requestContext);
      return successResponseFactory(
        rawResult === undefined ? "" : rawResult,
        requestContext.id
      );
    } catch (e) {
      if (e instanceof JSONRPCException) {
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
