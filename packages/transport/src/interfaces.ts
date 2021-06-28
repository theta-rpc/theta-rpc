type MessageCallback = (message: string, context?: unknown) => void;
type ReplyCallback = (message: string | null, context?: unknown) => void;

export interface TransportEvents {
  ["message"]: MessageCallback;
  ["reply"]: ReplyCallback;
  ["start"]: () => void;
  ["started"]: () => void;
  ["stop"]: () => void;
  ["stopped"]: () => void;
};
