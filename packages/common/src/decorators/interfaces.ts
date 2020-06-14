export interface IProcedure {
    namespace?: string
}

export interface IMethod {
    name: string,
    ref: (...args: any[]) => any
}
