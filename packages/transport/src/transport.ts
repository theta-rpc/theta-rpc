import { EventEmitter } from '@theta-rpc/events';
import { TransportEvents } from './interfaces';

export class Transport extends EventEmitter<TransportEvents> {
  constructor(public name?: string) { super(); }
}
