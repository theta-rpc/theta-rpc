import { IJsonRPCServerOptions, ITransport } from '../interfaces';
import { Logger } from '@theta-rpc/common';

export class JsonRPCServer {
    private logger = new Logger("Server");
    private transport!: ITransport;

    constructor(private options: IJsonRPCServerOptions) { }

    public setTransport<T>(transport: { new(...args: any[]): ITransport }, transportOptions: T): this {
        const transportInstance = new transport(this.options, transportOptions);
        this.transport = transportInstance;
        return this;
    }

    private registerTransportListeners(): void {
        this.transport.onStart(() => {
            this.logger.info('Starting..');
        });

        this.transport.onError((e: Error) => {
            this.logger.error(e.message);
        });

        this.transport.onStop(() => {
            this.logger.info('Server stopped');
        })
    }

    public activate(): void {
        this.logger.info('Loaded ' + this.transport.name);
        this.registerTransportListeners();
        this.transport.start();
    }

}
