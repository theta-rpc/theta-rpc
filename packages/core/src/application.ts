import createDebug from "debug";
import { ApplicationOptionsType } from "./types";
import { Server } from "./server";
import {
  Explorer,
  Executor,
  Container,
  HandlerType,
  AccessorType,
} from "./method";

const debug = createDebug("THETA-RPC");

export class Application {
  private container = new Container();
  private explorer = new Explorer(this.container);
  private executor = new Executor(this.container);
  private server = new Server(this.executor, this.options.server);

  constructor(private options: ApplicationOptionsType) {
    debug('Creating an application');
    this.exposeInternalMethods();
  }

  private exposeInternalMethods() {
    this.explorer.enableInternalMode();
    this.expose('rpc.ping', () => 'pong');
    this.explorer.disableInternalMode();
  }

  public expose(method: string, handler: HandlerType): boolean;
  public expose(method: string, accessors: AccessorType[], handler: HandlerType): boolean;
  public expose(method: string, handlerOrAccessor: HandlerType | AccessorType[], handler?: HandlerType): boolean {
    if(handlerOrAccessor instanceof Array) {
      return this.explorer.explore(method, handlerOrAccessor, handler!);
    }
    
    return this.explorer.explore(method, [], handlerOrAccessor);
  }

  public start(callback?: (error?: Error) => void) {
    debug("Starting the application");
    this.server.start().then(callback).catch(callback);
  }

  public stop(callback?: (error?: Error) => void) {
    this.server.shutdown().then(callback).catch(callback);
  }
}

export function createApplication(options: ApplicationOptionsType) {
  return new Application(options);
}
