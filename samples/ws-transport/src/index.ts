import { ThetaRPCFactory } from '@theta-rpc/core';
import { Procedure, Method } from '@theta-rpc/common';
import { WsTransport, IWsTransportOptions } from '@theta-rpc/ws-transport';


@Procedure('machine')
class MachineMethods {
  
  @Method('sayHello')
  public sayHello() {
    return 'Hello!';
  }
}


const bootstrap = () => {
  
  ThetaRPCFactory.create<IWsTransportOptions>({
    server: {
      transport: WsTransport,
      transportOptions: {
        port: 8080,
        endpoint: '/json-rpc'
      }
    },
    procedures: [MachineMethods]
  });

}

bootstrap();
