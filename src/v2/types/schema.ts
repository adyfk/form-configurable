/* eslint-disable no-use-before-define */
import { IDefaultProp, IExpressionString, IProp, ISchemaCore } from "./core";

// Field ===========================

export interface IOverrideField {
  condition?: boolean;
  expression?: IExpressionString;
  values?: any;
  valuesExpression?: Record<string, string>;
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
    attributeId?: string;
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
  props: (IProp & {
    name: keyof IDefaultProp
  })[];
}

export interface ISchemaFieldArrayDefault<TSchema = null> extends ISchemaFieldCore {
  variant: "FIELD-ARRAY",
  childs: ISchema<TSchema>[];
  component: "DEFAULT";
  props: (IProp & {
    name: keyof IDefaultProp
  })[];
}

export interface ISchemaFieldObjectDefault<TSchema = null> extends ISchemaFieldCore {
  variant: "FIELD-OBJECT";
  childs: ISchema<TSchema>[];
  component: "DEFAULT";
  props: (IProp & {
    name: keyof IDefaultProp
  })[];
}

// ======================================================

// GROUP ====

export interface ISchemaGroupCore extends ISchemaCore {
  variant: "GROUP";
}

export interface ISchemaGroupDefault<TMoreSchema = null> extends ISchemaGroupCore {
  component: "DEFAULT";
  childs: ISchema<TMoreSchema>[];
  props: (IProp & {
    name: keyof IDefaultProp
  })[];
}

export interface ISchemaGroupCustom<TProp> extends ISchemaGroupCore {
  props: (IProp & {
    name: keyof TProp | keyof IDefaultProp
  })[];
  readonly propStateType?: TProp & IDefaultProp
}

// ======================================================

// VIEW

export interface ISchemaViewCore extends ISchemaCore {
  variant: "VIEW";
  config: {
    name?: string;
    data?: any;
  };
}

export interface ISchemaViewDefault extends ISchemaViewCore {
  component: "DEFAULT";
  props: (IProp & {
    name: keyof IDefaultProp
  })[];
}

export interface ISchemaViewCustom<TProp> extends ISchemaViewCore {
  props: (IProp & {
    name: keyof TProp | keyof IDefaultProp
  })[];
  readonly propStateType?: TProp & IDefaultProp;
}

// ======================================================

// FORM

export interface ISchemaFormCore extends ISchemaCore {
  initialValue?: any;
  overrideSelf?: IExpressionString;
  overrides: IOverrideField[];
  rules: IRule[];
  config: {
    name: string;
    data?: any;
  };
}

export interface ISchemaFormDefault extends ISchemaFormCore {
  variant: "FORM",
  component: "DEFAULT";
  props: (IProp & {
    name: keyof IDefaultProp
  })[];
}

export interface ISchemaFormCustom<TProp> extends ISchemaFormCore {
  props: (IProp & {
    name: keyof TProp | keyof IDefaultProp
  })[]
  readonly propStateType?: TProp & IDefaultProp
}

// ======================================================

export type INativeSchema<TMoreSchema = null> = ISchemaFieldDefault |
  ISchemaFieldArrayDefault<TMoreSchema> |
  ISchemaFieldObjectDefault<TMoreSchema> |
  ISchemaGroupDefault<TMoreSchema> |
  ISchemaFormDefault |
  ISchemaViewDefault;

export type ISchema<TMoreSchema = null> = TMoreSchema extends ISchemaCore ? INativeSchema<TMoreSchema> | TMoreSchema : INativeSchema
