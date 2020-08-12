import { Logger } from '@theta-rpc/common';
import { JsonRPCServer } from './server';
import { MethodsExplorer, MethodsContainer } from './method';

import { IThetaRPCFactoryOptions } from './interfaces';


class StaticThetaRPCFactory {
    private _logger = new Logger('Factory');

    public create<TTransportOptions>(options: IThetaRPCFactoryOptions<TTransportOptions>): JsonRPCServer<TTransportOptions> {
        const { server, procedures } = options;

        const methodsContainer = new MethodsContainer();
        const methodsExplorer = new MethodsExplorer(methodsContainer);

        const rpcServer = new JsonRPCServer(methodsContainer, server);

        methodsExplorer.explore(procedures || []);
        rpcServer.start();

        return rpcServer;
    }

}

export const ThetaRPCFactory = new StaticThetaRPCFactory();
