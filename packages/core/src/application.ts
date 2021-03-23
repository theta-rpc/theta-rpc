import createDebug from "debug";
import { ApplicationOptionsType } from "./types";
import { Server } from "./server";
import { Explorer, Executor, Container } from "./method";
import { Composer } from "./transport";

const debug = createDebug("THETA-RPC");

export class Application {
  private container = new Container();
  private explorer = new Explorer(this.container);
  private executor = new Executor(this.container);
  private composer = new Composer();
  private server = new Server(this.composer, this.executor);

  constructor(private options: ApplicationOptionsType) { }

  public start(callback?: (error?: Error) => void) {
    debug("Starting the application..");
    this.composer.load(this.options.server.transports);
    this.explorer.explore([...(this.options.methods || [])]);
    this.server.start(callback);
  }

  public stop(callback?: (error?: Error) => void, clear: boolean = false) {
    if (clear) {
      this.composer.clearInstances();
      this.container.clear();
    }

    this.server.shutdown(callback);
  }
}

export function createApplication(options: ApplicationOptionsType) {
  return new Application(options);
}
