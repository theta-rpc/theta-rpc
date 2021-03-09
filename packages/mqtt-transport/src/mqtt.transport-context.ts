import mqtt from 'mqtt';
import { IMQTTTransportContext } from './interfaces';

export class MQTTTransportContext implements IMQTTTransportContext {
  constructor(private client: mqtt.Client, private topic: string) { }

  public getClient() {
    return this.client;
  }

  public getTopic() {
    return this.topic;
  }
}
