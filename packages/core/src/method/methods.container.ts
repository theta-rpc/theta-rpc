import { IMethodMetadata } from '../interfaces';

export class MethodsContainer {
    private _registry = new Map<string, IMethodMetadata>();

    constructor() { }

    public add(name: string, method: IMethodMetadata): void {
        this._registry.set(name, method);
    }

    public exists(name: string): boolean {
        return this._registry.has(name);
    }

    public delete(name: string): void {
        this._registry.delete(name);
    }

    public clear() {
        this._registry.clear();
    }

    public get(name: string) {
        return this._registry.get(name);
    }

}
