import mqtt from 'mqtt';
import { IMQTTTransportContext } from './interfaces';

export class MQTTTransportContext implements IMQTTTransportContext {
  constructor(private packet: mqtt.Packet) { }

  public getPacket() {
    return this.packet;
  }
}
