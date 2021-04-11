import events from "eventemitter3";

export class EventEmitter<
  EventTypes extends events.ValidEventTypes
> extends events.EventEmitter<EventTypes> {
  constructor() {
    super();
  }

  public toPromise<T extends events.EventNames<EventTypes>>(
    event: T,
    timeout: number = 2000
  ): Promise<any> {
    let emitted: boolean = false;

    return new Promise((resolve, reject) => {
      //FIXME
      //@ts-ignore
      this.on(event, (...args: any[]) => {
        resolve(args);
        emitted = true;
      });

      setTimeout(() => {
        if (!emitted) reject(new Error("Timeout error"));
      }, timeout);
    });
  }
}
