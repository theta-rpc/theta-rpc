import createDebug from "debug";
import { ApplicationOptionsType } from "./types";
import { Server } from "./server";
import { Explorer, Executor, Container, RPCExtension } from "./method";
import { Composer } from "./transport";

const debug = createDebug("THETA-RPC");

export class Application {
  private container = new Container();
  private explorer = new Explorer(this.container);
  private executor = new Executor(this.container);
  private server = new Server(this.executor, this.options.server);

  constructor(private options: ApplicationOptionsType) { }

  public start(callback?: (error?: Error) => void) {
    debug("Starting the application..");
    this.explorer.explore([RPCExtension], true);
    this.explorer.explore([...(this.options.methods || [])]);
    this.server.start(callback);
  }

  public stop(callback?: (error?: Error) => void) {
    this.server.shutdown(callback);
  }
}

export function createApplication(options: ApplicationOptionsType) {
  return new Application(options);
}
