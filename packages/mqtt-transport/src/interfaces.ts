import mqtt from "mqtt";

export interface IMQTTTransportOptions extends mqtt.IClientOptions {
  brokerURL: string,
  inTopic?: string,
  outTopic?: string
}

export interface IMQTTTransportContext {
  getClient(): mqtt.Client,
  getTopic(): string
}
