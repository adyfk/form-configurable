import { ExpressionString, SchemaBase } from './core';

interface MetaField {
  placeholder: string;
  label: string;
  suffix: string;
  prefix: string;
  tooltip: string;
  hint: string;
  badge: string;
  optional: boolean;
  required: boolean;
  [key: string]: any;
}

interface BaseRule {
  expression: ExpressionString;
  error: string;
}

interface BaseOverride {
  self: ExpressionString;
  // event when onchange self field
  others: Record<string, any>;
}

interface BaseField extends SchemaBase {
  variant: 'FIELD';
  initialValue: any;
  fieldName: string;
  override?: Partial<BaseOverride>;
  rules?: BaseRule[];
}

export interface SchemaFieldText extends BaseField {
  fieldType: 'TEXT';
  valueType: 'STRING' | 'NUMBER';
  meta?: Partial<MetaField>;
}

export interface SchemaFieldHidden extends BaseField {
  fieldType: 'HIDDEN';
  meta?: Partial<MetaField>;
}

export interface SchemaFieldTextArea extends BaseField {
  fieldType: 'TEXTAREA';
  valueType: 'STRING';
  meta?: Partial<MetaField> & Partial<{ rows: number; cols: number }>;
}

export interface SchemaFieldWyswyg extends BaseField {
  fieldType: 'WYSWYG';
  valueType: 'STRING';
  meta?: Partial<MetaField> & Partial<{ rows: number; cols: number }>;
}

export interface SchemaFieldOption extends BaseField {
  fieldType: 'DROPDOWN' | 'CHECKBOX' | 'RADIO';
  valueType: 'NUMBER' | 'STRING' | 'OBJECT';
  meta?: Partial<MetaField> & {
    options: any[];
    row?: boolean;
  };
}

export interface SchemaFieldDate extends BaseField {
  fieldType: 'DATE';
  valueType: 'DATE';
  meta?: Partial<MetaField> & {
    format: string;
    view: ('month' | 'year')[];
  };
}

export interface SchemaFieldFile extends BaseField {
  fieldType: 'FILE';
  valueType: 'ARRAY_OBJECT';
  meta?: Partial<MetaField> &
    Partial<{
      multiple: boolean;
    }>;
}

export interface SchemaFieldCustom extends BaseField {
  fieldType: 'CUSTOM';
  meta: Partial<MetaField> & Record<string, any>;
}

export type SchemaField =
  | SchemaFieldText
  | SchemaFieldTextArea
  | SchemaFieldWyswyg
  | SchemaFieldOption
  | SchemaFieldFile
  | SchemaFieldDate
  | SchemaFieldCustom
  | SchemaFieldHidden;
