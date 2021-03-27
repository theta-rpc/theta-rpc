import { EventEmitter } from '@theta-rpc/events';
import { TransportEventsType } from './types';

export class ThetaTransport extends EventEmitter<TransportEventsType> {
  constructor(public name: string) { super(); }
}
