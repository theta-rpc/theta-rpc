import { MethodObjectType } from './types';

export class Container {
  private methods: MethodObjectType[] = [];

  constructor() {}

  public add(method: MethodObjectType) {
    this.methods.push(method);
  }

  public exists(method: string): boolean {
    return this.methods.some((val) => val.method === method);
  }

  public get(method: string): MethodObjectType | undefined {
    return this.methods.find((val) => val.method === method);
  }

  public clear() {
    this.methods = [];
  }
}
