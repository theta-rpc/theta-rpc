export type Params = { [key: string]: any } | any[];
export type Id = number | string;
export type ResponseId = number | string | null;

export interface Message {
  jsonrpc: '2.0',
  method: string
  params: Params,
  id: Id
}

export interface NotifMessage extends Omit<Message, 'id'> { }

export interface ResponseMessage {
  jsonrpc: '2.0',
  result: any,
  id: ResponseId
}

export interface ErrorObject {
  code: number,
  message: string,
  data?: any
}

export interface ErrorResponseMessage {
  jsonrpc: '2.0',
  error: ErrorObject,
  id: ResponseId
}
