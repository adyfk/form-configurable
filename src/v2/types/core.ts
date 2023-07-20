import { IObject } from "./utils";

export type IExpressionString = string;

export type IVariant = "FIELD" | "FIELD-ARRAY" | "FIELD-OBJECT" | "VIEW" | "GROUP" | "FORM"

export type ISchemaVersion = "v1" | "v2"

export interface IDefaultProp {
  disabled: boolean;
  hidden: boolean;
}

export interface IDefaultField {
  touched: boolean;
}

export type IProp = {
  condition?: boolean;
  name: string;
  expression?: IExpressionString;
  value?: any;
  expressionValue?: IExpressionString;
}

export type IStyles = {
  container: any;
  root: any;
  content: any;
}

export type ISchemaCore = {
  version?: ISchemaVersion,
  key?: string;
  variant: IVariant;
  component: string;
  config: {
    name?: string;
    data?: any;
  };
  props: IProp[];
  styles?: Partial<IStyles>;
  attribute?: IObject;
  readonly propStateType?: IDefaultProp
}
