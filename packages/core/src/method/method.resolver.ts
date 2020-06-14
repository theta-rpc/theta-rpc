import { Logger, CommonUtils as utils, METADATA_KEY, IProcedure, IMethod, Type } from '@theta-rpc/common';
import { MethodContainer } from './method.container';

export class MethodResolver {
    private logger = new Logger('Method resolver');
    private container = new MethodContainer();

    constructor() { }

    private analyzeAndStore(procedure: Type<any>) {
        const procedureMd = utils.getMetadata(METADATA_KEY.procedure, procedure) as IProcedure;
        const proto = procedure.prototype
        const methods = Object.getOwnPropertyNames(proto);

        for(let method of methods) {
            if(utils.isMethod(proto[method])) {
                const methodMd = utils.getMetadata(METADATA_KEY.method, proto[method]) as IMethod;
                const methodName = utils.buildMethodName(methodMd.name, procedureMd.namespace);

                if(!this.container.exists(methodName)) {
                    this.container.add(methodName, { handler: methodMd.ref });
                    this.logger.info('Mapped: ' + methodName);
                }
            }
        }
    }

    public resolve(procedures: Type<any>[]) {
        if(procedures.length) {
            for(let procedure of procedures) {
                this.analyzeAndStore(procedure);
            }
        } else {
            this.logger.warning('Methods length equals to 0');
        }
    }

    public getContainer(): MethodContainer {
        return this.container;
    }
}
