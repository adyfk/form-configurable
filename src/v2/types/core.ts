import { IObject } from "./utils";

export type IExpressionString = string;

export type IVariant = "FIELD" | "FIELD-ARRAY" | "FIELD-OBJECT" | "VIEW" | "GROUP"

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
  value: any;
  expressionValue?: IExpressionString;
}

export type IStyles = {
  container: string;
  root: string;
  content: string;
}

export type ISchemaCore = {
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
