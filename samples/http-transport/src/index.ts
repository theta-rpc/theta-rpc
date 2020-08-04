import { ThetaRPCFactory } from '@theta-rpc/core';
import { Procedure, Method } from '@theta-rpc/common';
import { HttpTransport, IHttpTransportOptions } from '@theta-rpc/http-transport';


@Procedure('machine')
class MachineMethods {
  
  @Method('sayHello')
  public sayHello() {
    return 'Hello!';
  }
}


const bootstrap = () => {
  
  ThetaRPCFactory.create<IHttpTransportOptions>({
    server: {
      transport: HttpTransport,
      transportOptions: {
        port: 8080,
        endpoint: '/json-rpc'
      }
    },
    procedures: [MachineMethods]
  });

}

bootstrap();
