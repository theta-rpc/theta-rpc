<p align="center">
    <img src="assets/theta-logo.png">
</p>

## Installation

with npm:
```shell
npm install --save @theta-rpc/{core,common,errors,http-transport}
```

with yarn:
```shell
yarn add @theta-rpc/{core,common,errors,http-transport}
```

## Simple usage
```typescript
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

```
You can see other samples in the **samples** folder
