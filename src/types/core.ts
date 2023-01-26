export type ExpressionString = string;
export type ClassName = string;

export interface BaseStyle {
  container: any;
  content: any;
  badge: any[];
  infoTooltip: string;
  warningTooltip: string;
  dangerTooltip: string;
  htmlTooltip: string;
  hint: string;
  [key: string]: any;
}

export interface BaseProp {
  name: 'editable' | 'show' | string;
  value?: any;
  expression?: ExpressionString | null;
}

export interface SchemaBase {
  name?: string;
  key?: string;
  style?: Partial<BaseStyle>;
  props?: BaseProp[];
}
