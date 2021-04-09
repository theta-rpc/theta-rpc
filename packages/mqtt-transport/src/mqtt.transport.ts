import createDebug from "debug";
import mqtt from "mqtt";
import { ThetaTransport } from "@theta-rpc/transport";
import { IMQTTTransportOptions } from "./interfaces";
import { MQTTTransportContext } from "./mqtt.transport-context";

const debug = createDebug("THETA-RPC:MQTT-TRANSPORT");

export class MQTTTransport extends ThetaTransport {
  private client!: mqtt.Client;
  constructor(private options: IMQTTTransportOptions) {
    super("MQTT transport");
    this.listen();
  }

  private listen() {
    this.on("reply", (data) => this.reply(data));
    this.on("start", () => this.connect());
    this.on("stop", () => this.disconnect());
  }

  private reply(data: any) {
    const outTopic = this.options.outTopic || "jsonrpc-out";
    if (data) this.client.publish(outTopic, JSON.stringify(data));
  }

  private handleError(err: Error) {
    debug(err);
  }

  private connect() {
    const inTopic = this.options.inTopic || "jsonrpc-in";
    this.client = mqtt
      .connect(this.options.brokerURL, this.options)
      .once("connect", () => {
        this.emit("started");
        this.client.subscribe(inTopic);
        this.client.on("message", (topic, payload, packet) => {
          const context = this.createContext(packet);
          this.emit("message", payload, context);
        });
      })
      .on("error", (err) => this.handleError(err));
  }

  private createContext(packet: mqtt.Packet) {
    return new MQTTTransportContext(packet);
  }
  private disconnect() {
    this.client.end(false, undefined, () => this.emit("stopped"));
  }
}
