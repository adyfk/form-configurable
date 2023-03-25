import { ISchemaCore, IExpressionString, IProp, IDefaultProp } from "./core";
import { ISchema } from "./schema";
export interface IOverrideField {
    condition: boolean;
    expression: IExpressionString;
    values: any;
}
export type IRule = {
    condition?: boolean;
    expression: IExpressionString;
    message: string;
};
export interface ISchemaFieldCore extends ISchemaCore {
    initialValue?: any;
    overrideSelf?: IExpressionString;
    overrides: IOverrideField[];
    rules: IRule[];
    config: {
        name: string;
        data?: any;
    };
}
export interface ISchemaFieldCustom<T> extends ISchemaFieldCore {
    props: (IProp & {
        name: keyof T | keyof IDefaultProp;
    })[];
    readonly propStateType?: T & IDefaultProp;
}
export interface ISchemaFieldArrayCustom<T> extends ISchemaFieldCore {
    props: (IProp & {
        name: keyof T | keyof IDefaultProp;
    })[];
    childs: ISchema[];
    readonly propStateType?: T & IDefaultProp;
}
export interface ISchemaFieldObjectCustom<T> extends ISchemaFieldCore {
    props: (IProp & {
        name: keyof T | keyof IDefaultProp;
    })[];
    childs: ISchema[];
    readonly propStateType?: T & IDefaultProp;
}
export type ISchemaFieldAllCustom<T = any> = ISchemaFieldCustom<T> | ISchemaFieldArrayCustom<T> | ISchemaFieldObjectCustom<T>;
export interface ISchemaFieldDefault extends ISchemaFieldCore {
    variant: "FIELD";
    component: "DEFAULT";
}
export interface ISchemaFieldArrayDefault extends ISchemaFieldCore {
    variant: "FIELD-ARRAY";
    childs: ISchema[];
    component: "DEFAULT";
}
export interface ISchemaFieldObjectDefault extends ISchemaFieldCore {
    variant: "FIELD-OBJECT";
    childs: ISchema[];
    component: "DEFAULT";
}
