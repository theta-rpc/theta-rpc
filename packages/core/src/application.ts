import createDebug from "debug";
import { Application } from "./types";
import { Server, ServerOptions } from "./server";
import {
  Explorer,
  Executor,
  Container,
  HandlerType,
  AccessorType,
} from "./method";

const debug = createDebug("THETA-RPC");

type ApplicationOptions = ServerOptions;

class ApplicationImpl implements Application {
  private container: Container;
  private explorer: Explorer;
  private executor: Executor;
  private server: Server;

  constructor(private options: ApplicationOptions) {
    debug('Creating an application');
    this.container = new Container();
    this.explorer = new Explorer(this.container);
    this.executor = new Executor(this.container);
    this.server = new Server(this.executor, this.options);
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

export function createApplication(options: ApplicationOptions): Application {
  return new ApplicationImpl(options);
}
