/* eslint-disable no-use-before-define */
import { IDefaultProp, IExpressionString, IProp, ISchemaCore } from "./core";

// Field ===========================

export interface IOverrideSchema extends ISchemaCore {
  comopnent: string;
}

export interface IOverrideField {
  condition: boolean;
  expression: IExpressionString;
  values: any;
}

export type IRule = {
  condition?: boolean;
  expression: IExpressionString;
  message: string;
}

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

export interface ISchemaFieldCustom<TProp> extends ISchemaFieldCore {
  props: (IProp & {
    name: keyof TProp | keyof IDefaultProp
  })[]
  readonly propStateType?: TProp & IDefaultProp
}

export interface ISchemaFieldArrayCustom<TProp> extends ISchemaFieldCore {
  props: (IProp & {
    name: keyof TProp | keyof IDefaultProp
  })[];
  readonly propStateType?: TProp & IDefaultProp
}

export interface ISchemaFieldObjectCustom<TProp> extends ISchemaFieldCore {
  props: (IProp & {
    name: keyof TProp | keyof IDefaultProp
  })[];
  readonly propStateType?: TProp & IDefaultProp
}

export interface ISchemaFieldDefault extends ISchemaFieldCore {
  variant: "FIELD",
  component: "DEFAULT";
}

export interface ISchemaFieldArrayDefault<TSchema = null> extends ISchemaFieldCore {
  variant: "FIELD-ARRAY",
  childs: ISchema<TSchema>[];
  component: "DEFAULT";
}

export interface ISchemaFieldObjectDefault<TSchema = null> extends ISchemaFieldCore {
  variant: "FIELD-OBJECT";
  childs: ISchema<TSchema>[];
  component: "DEFAULT";
}

// ======================================================

// GROUP ====

export interface ISchemaGroupCore extends Omit<ISchemaCore, "initialValue"> {
  variant: "GROUP";
}

export interface ISchemaGroupDefault<TMoreSchema = null> extends ISchemaGroupCore {
  component: "DEFAULT";
  childs: ISchema<TMoreSchema>[]
}

export interface ISchemaGroupCustom<TProp> extends ISchemaGroupCore {
  props: (IProp & {
    name: keyof TProp
  })[];
  readonly propStateType?: TProp & IDefaultProp
}

// ======================================================

// VIEW

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

export interface ISchemaViewCustom<TProp> extends ISchemaViewCore {
  props: (IProp & {
    name: keyof TProp;
  })[];
  readonly propStateType?: TProp & IDefaultProp;
}

// ======================================================

export type INativeSchema<TMoreSchema = null> = ISchemaFieldDefault |
  ISchemaFieldArrayDefault<TMoreSchema> |
  ISchemaFieldObjectDefault<TMoreSchema> |
  ISchemaGroupDefault<TMoreSchema> |
  ISchemaViewDefault;

export type ISchema<TMoreSchema = null> = TMoreSchema extends ISchemaCore ? INativeSchema<TMoreSchema> | TMoreSchema : INativeSchema
