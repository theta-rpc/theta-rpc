import { ThetaRPCFactory, IContext } from '@theta-rpc/core';
import { Procedure, Method } from '@theta-rpc/common';
import { WsTransport, IWsTransportOptions } from '@theta-rpc/ws-transport';

interface IExpectedParams {
  a: number;
  b: number
}

@Procedure('calc')
class MachineMethods {
  
  @Method('add')
  public sayHello(context: IContext<IExpectedParams>) {
    const { params } = context;
    if(params && params.a && params.b) { // <3
      return params.a + params.b;
    }
    
    return 'Please provide parameters';
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
