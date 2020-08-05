<p align="center">
    <img src="assets/theta-logo.png">
    <br>
    <img src="https://img.shields.io/github/license/Capgop/theta-rpc">
    <img src="https://img.shields.io/npm/v/@theta-rpc/core">
    <img src="https://api.travis-ci.com/Capgop/theta-rpc.svg?branch=master">
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

## Dependencies

| Package | Status |
| ------------- | ------------- |
| @theta-rpc/core  | <img src="https://img.shields.io/librariesio/release/npm/@theta-rpc/core/1.2.0">  |
| @theta-rpc/common  | <img src="https://img.shields.io/librariesio/release/npm/@theta-rpc/common/1.2.0">  |
| @theta-rpc/errors  | <img src="https://img.shields.io/librariesio/release/npm/@theta-rpc/errors/1.2.0">  |
| @theta-rpc/http-transport  | <img src="https://img.shields.io/librariesio/release/npm/@theta-rpc/http-transport/1.2.0">  |
| @theta-rpc/ws-transport | <img src="https://img.shields.io/librariesio/release/npm/@theta-rpc/ws-transport/1.2.0">  |
