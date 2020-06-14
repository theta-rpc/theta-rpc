import { IMethodContainerItem } from './interfaces';


export class MethodContainer {
    private methods = new Map<string, IMethodContainerItem>();

    constructor() { }

    public clear(): void {
        this.methods.clear();
    }

    public get(method: string): IMethodContainerItem | undefined {
        return this.methods.get(method);
    }

    public add(method: string, value: IMethodContainerItem): void {
        this.methods.set(method, value);
    }

    public exists(method: string): boolean {
        return this.methods.has(method);
    }

}
