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
        this.transport.onListening(() => {
            this.logger.info('Listening ...');
        });

        this.transport.onClose(() => {
            this.logger.warning('Server closed');
        });

        this.transport.onError((e: Error) => {
            this.logger.error(e.message);
        });
    }

    public activate(): void {
        this.logger.info('Loaded ' + this.transport.name);
        this.registerTransportListeners();
        this.transport.up();
    }

    public kill() {
        this.transport.down();
    }

}