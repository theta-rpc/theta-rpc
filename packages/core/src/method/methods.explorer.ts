import { Logger, utils, metadata_key, IProcedure, IMethod, ClassType } from '@theta-rpc/common';
import { MethodsContainer } from './methods.container';

export class MethodsExplorer {
    private _logger = new Logger('Methods Explorer');

    constructor(
        private _container: MethodsContainer
    ) { }

    private decoratedMethods(procedure: ClassType<any>) {
        const instance = new procedure();
        const methods = Object.getOwnPropertyNames(procedure.prototype);
        const decoratedMethods = [];

        for(let method of methods) {
            if(utils.isMethod(instance[method])) {
                decoratedMethods.push(instance[method]);
            }
        }

        return [instance, decoratedMethods];
    }

    private decoratedClasses(procedures: ClassType<any>[]) {
        const decoratedClasses = [];

        for(let procedure of procedures) {
            if(utils.isProcedure(procedure)) {
                decoratedClasses.push(procedure);
            } else {
                this._logger.warning(`${procedure.name} is not decorated`)
            }
        }

        return decoratedClasses;
    }

    private analyzeAndStore(procedures: ClassType<any>[]) {
        const decoratedProcedures = this.decoratedClasses(procedures);

        for(let procedure of decoratedProcedures) {
            const classMetadata = utils.getMetadata(metadata_key.procedure, procedure) as IProcedure;
            const [instance, decoratedMethods] = this.decoratedMethods(procedure);

            for(let method of decoratedMethods) {

                const methodMetadata = utils.getMetadata(metadata_key.method, method) as IMethod;
                const methodName = utils.buildMethodName(methodMetadata.name, classMetadata.namespace);

                if(!this._container.exists(methodName)) {

                    this._container.add(methodName, { handler: instance[methodMetadata.key].bind(instance) });
                    this._logger.info(methodName);
                } else {
                    this._logger.warning(`${methodName} is already registered`);
                }

            }
        }
    }

    public explore(procedures: ClassType<any>[]) {
        if(procedures.length) {
            this.analyzeAndStore(procedures);
        }
    }
}
