import mqtt from "mqtt";

export interface IMQTTTransportOptions extends mqtt.IClientOptions {
  brokerURL?: string;
  inTopic?: string | string[];
  outTopic?: string;
}

export interface IMQTTTransportContext {
  getPacket(): mqtt.Packet
}
