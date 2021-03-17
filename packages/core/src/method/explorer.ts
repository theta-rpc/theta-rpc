import createDebug from "debug";
import { Container } from "./container";
import { ConstructorType } from "../types";
import { MethodObjectType, AccessorType } from "./types";
import { isProtected, getMetadata } from "../decorators/utils";

const debug = createDebug("THETA-RPC");
const INTERNAL_METHOD_REGEXP = /rpc.\w+/g;

export class Explorer {
  constructor(private container: Container) {}

  private tryStoreMethod(method: MethodObjectType) {
    if (this.container.exists(method.method)) {
      return;
    }
    this.container.add(method);
  }

  public explore(
    constructors: ConstructorType[],
    internal: boolean = false
  ): void {
    for (const constructor of constructors) {
      debug("Exploring: %s", constructor.name);
      const instance = new constructor();
      const instanceMethods = Object.getOwnPropertyNames(constructor.prototype);
      let accessors: AccessorType[] = [];

      if (isProtected(constructor)) {
        accessors = getMetadata(constructor).accessors;
      }

      for (const method of instanceMethods) {
        if (
          typeof method !== "string" ||
          method === "constructor" ||
          (!internal && INTERNAL_METHOD_REGEXP.test(method))
        ) {
          continue;
        }

        if (isProtected(instance[method])) {
          accessors = accessors.concat(getMetadata(instance[method]).accessors);
        }

        this.tryStoreMethod({
          method,
          handler: instance[method].bind(instance),
          accessors,
        });
        debug(" %s", method);
      }
    }
  }
}
