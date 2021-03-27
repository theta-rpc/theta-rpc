export type CallbackType = (data: any, transportContext?: any) => void;

export type TransportEventsType = {
  ["message"]: CallbackType;
  ["reply"]: CallbackType;
  ["start"]: () => void;
  ["started"]: () => void;
  ["stop"]: () => void;
  ["stopped"]: () => void;
};
