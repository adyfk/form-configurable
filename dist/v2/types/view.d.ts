import { IDefaultProp, IProp, ISchemaCore } from "./core";
export interface ISchemaViewCore extends Omit<ISchemaCore, "initialValue"> {
    variant: "VIEW";
    config: {
        name?: string;
        data?: any;
    };
}
export interface ISchemaViewDefault extends ISchemaViewCore {
    component: "DEFAULT";
}
export interface ISchemaViewCustom<T> extends ISchemaViewCore {
    props: (IProp & {
        name: keyof T;
    })[];
    readonly propStateType?: T & IDefaultProp;
}
