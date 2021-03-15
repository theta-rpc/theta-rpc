//FIXME: context type
export type AccessorType = (context: any) => Promise<boolean> | boolean;

export type MethodObjectType = {
  method: string,
  //FIXME: context type
  handler: (context: any) => any,
  accessors: AccessorType[]
}
