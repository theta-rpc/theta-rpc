import createDebug from 'debug';
import mqtt from 'mqtt';
import { ThetaTransport } from '@theta-rpc/transport';
import { IMQTTTransportContext, IMQTTTransportOptions } from './interfaces';
import { MQTTTransportContext } from './mqtt.transport-context';

const debug = createDebug('THETA-RPC:MQTT-TRANSPORT');

export class MQTTTransport extends ThetaTransport{
  private client!: mqtt.Client;
  private defaultOutTopic = 'theta-out';
  private defaultInTopic = 'theta-in';
  private onRequestCb!: any;

  constructor(private options: IMQTTTransportOptions) {
    super('MQTT transport');
  }

  public onRequest(cb: (data: any, transportContext: any) => void): void {
    this.onRequestCb = cb;
  }

  public reply(data: any): Promise<void> {
    const outTopic = this.options.outTopic || this.defaultOutTopic;
    return new Promise((resolve, reject) => {
      this.client.publish(outTopic, JSON.stringify(data), {}, (error?: Error) => {
        if(error) {
          debug(error);
          reject();
          return;
        }
        resolve();
      });
    })
  }

  private handleErrors() {
    this.client.on('error', (error) => {
      debug(error);
    })
  }

  private createContext(client: mqtt.Client, topic: string) {
    return new MQTTTransportContext(client, topic);
  }

  public start(): Promise<void> {
    const inTopic = this.options.inTopic || this.defaultInTopic;
    return new Promise((resolve, reject) => {
      this.client = mqtt
        .connect(this.options.brokerURL, this.options)
        .once("connect", resolve)
        .once("error", reject);
        this.handleErrors();
        this.client.subscribe(inTopic);
        this.client.on("message", (topic, payload) => {
          const context = this.createContext(this.client, topic);
          this.onRequestCb(payload, context);
        });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      this.client.end(false, undefined, resolve);
    })
  }
}
