import createDebug from "debug";
import {
  JSONRPCException,
  NoAccessToMethodException,
  MethodNotFoundException,
  InternalErrorException,
  successResponseFactory,
  errorResponseFactory,
  ResponseObjectType,
} from "@theta-rpc/json-rpc";
import { Container } from "./container";
import { RequestContext } from "../server/types";
import { AccessorType } from "./types";

const errorDebug = createDebug("THETA-RPC:ERROR");

export class Executor {
  constructor(private container: Container) {}

  private async executeEachAccessor(
    accessors: AccessorType[],
    context: RequestContext
  ): Promise<void> {
    for (const accessor of accessors) {
      if (!(await accessor(context))) {
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
    context: RequestContext
  ): Promise<ResponseObjectType> {
    try {
      const method = this.tryGetMethod(name);
      await this.executeEachAccessor(method.accessors, context);
      const rawResult = await method.handler(context);
      return successResponseFactory(
        rawResult === undefined ? "" : rawResult,
        context.id
      );
    } catch (e) {
      if (e instanceof JSONRPCException) {
        return errorResponseFactory(e, context.id);
      }

      errorDebug(e);
      return errorResponseFactory(new InternalErrorException(), context.id);
    }
  }
}
