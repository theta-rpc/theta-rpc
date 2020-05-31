export interface IProcedure {
    target: any,
    namespace?: string
}

export interface IMethod {
    name: string,
    target: any,
    key: string
}