import { IDefaultProp, IProp, ISchemaCore } from "./core";
import { ISchema } from "./schema";
export interface ISchemaGroupCore extends Omit<ISchemaCore, "initialValue"> {
    variant: "GROUP";
    childs: ISchema[];
}
export interface ISchemaGroupDefault extends ISchemaGroupCore {
    component: "DEFAULT";
    initialValue: any;
}
export interface ISchemaGroupCustom<T> extends ISchemaGroupCore {
    props: (IProp & {
        name: keyof T;
    })[];
    readonly propStateType?: T & IDefaultProp;
}
