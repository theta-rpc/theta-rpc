import { IJsonRPCFactoryOptions } from './interfaces';

import { Logger } from '@theta-rpc/common';

export class JsonRPCFactory {
    private logger = new Logger("🏭 Factory");

    constructor(private options: IJsonRPCFactoryOptions) { }

    public start() {
        this.logger.info("Starting...");
    }
}