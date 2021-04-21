import createDebug from "debug";
import { Container } from "./container";
import { AccessorType, HandlerType } from "./types";

const debug = createDebug("THETA-RPC");

export class Explorer {
  private internalMode = false;
  constructor(private container: Container) {}

  public enableInternalMode() {
    this.internalMode = true;
  }

  public disableInternalMode() {
    this.internalMode = false;
  }

  public explore(
    method: string,
    accessors: AccessorType[],
    handler: HandlerType
  ): boolean {
    if(!this.internalMode && /rpc.\w+/g.test(method)) {
      debug('Method names that begin with \'rpc.\' are reserved for internal methods')
      return false;
    }

    if(this.container.exists(method)) {
      debug('Method: \'%s\' already exists', method);
      return false;
    }

    this.container.add({ method, accessors, handler });
    debug('Explored: %s', method);
    return true;
  }
}
