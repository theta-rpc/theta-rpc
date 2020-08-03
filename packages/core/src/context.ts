import { IContext, IConcreteJsonRPCObj } from './interfaces';

export class Context<TParams> implements IContext<TParams> {
    constructor(
        public id: number | null,
        public method: string,
        public params: TParams,
        public inBatchScope: boolean,
        public isNotification: boolean,
        public rpcBody: IConcreteJsonRPCObj
    ) { }
}