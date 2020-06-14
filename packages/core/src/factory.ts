import { IJsonRPCFactoryOptions } from './interfaces';

import { Logger } from '@theta-rpc/common';
import { MethodResolver } from './method/method.resolver';

export class JsonRPCFactory {
    private logger = new Logger("Factory");
    private methodResolver = new MethodResolver();

    constructor(private options: IJsonRPCFactoryOptions) { }

    private load() {
        this.methodResolver.resolve(this.options.procedures || []);
    }

    public start() {
        this.logger.info("Starting...");
        this.load();
        this.options.server.activate();
    }
}
