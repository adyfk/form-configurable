import { ExpressionString, SchemaBase } from './core';
import { Schema } from './schema';

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
  error?: string;
  catch?: string;
}

interface BaseOverride {
  self: ExpressionString;
  // event when onchange self field
  others: Record<string, any>;
}

export interface IOption {
  label: string;
  value: any;
}

interface BaseField extends SchemaBase {
  variant: 'FIELD';
  initialValue: any;
  name: string;
  override?: Partial<BaseOverride>;
  rules?: BaseRule[];
}

export interface SchemaFieldText extends BaseField {
  fieldType: 'TEXT';
  valueType: 'STRING' | 'NUMBER';
  initialValue: string | number;
  meta?: Partial<MetaField>;
}

export interface SchemaFieldTextArea extends BaseField {
  fieldType: 'TEXTAREA';
  valueType: 'STRING';
  initialValue: string;
  meta?: Partial<MetaField> & Partial<{ rows: number; cols: number }>;
}

export interface SchemaFieldWyswyg extends BaseField {
  fieldType: 'WYSWYG';
  valueType: 'STRING';
  initialValue: string;
  meta?: Partial<MetaField> & Partial<{ rows: number; cols: number }>;
}

export interface SchemaFieldCheckbox extends BaseField {
  fieldType: 'CHECKBOX';
  initialValue: IOption[];
  meta?: Partial<MetaField> & {
    options: IOption[];
    row?: boolean;
    other?: boolean;
  };
}

export interface SchemaFieldRadio extends BaseField {
  fieldType: 'RADIO';
  initialValue: IOption;
  meta?: Partial<MetaField> & {
    options: IOption[];
    row?: boolean;
    other?: boolean;
  };
}

export interface SchemaFieldDropdown extends BaseField {
  fieldType: 'DROPDOWN';
  initialValue: IOption;
  meta?: Partial<MetaField> & {
    options: IOption[];
    other?: boolean;
  };
}

export interface SchemaFieldDropdownAsync extends BaseField {
  fieldType: 'DROPDOWN-ASYNC';
  initialValue: IOption;
  meta?: Partial<MetaField> & {
    optionUrl: string;
    other?: boolean;
  };
}

export interface SchemaFieldCounter extends BaseField {
  fieldType: 'COUNTER';
  initialValue: number;
  meta?: Partial<MetaField> & {
    min?: number;
    max?: number;
  };
}

export interface SchemaFieldSwitch extends BaseField {
  fieldType: 'SWITCH';
  initialValue: boolean;
  meta?: Partial<MetaField>;
}

export interface SchemaFieldDate extends BaseField {
  fieldType: 'DATE';
  valueType: 'DATE';
  meta?: Partial<MetaField> & {
    format: string;
    view: ('month' | 'year')[];
  };
}

export interface SchemaFieldDateRange extends BaseField {
  fieldType: 'DATERANGE';
  valueType: 'DATE';
  meta?: Partial<MetaField> & {
    format: string;
  };
  initialValue: { start: string; end: string };
}

export interface SchemaFieldFile extends BaseField {
  fieldType: 'FILE';
  initialValue: [];
  meta?: Partial<MetaField> & {
    description?: string;
    uploadUrl?: string;
    maxFile?: number;
    maxSize?: number; // mb
    allowExtension?: (
      | 'txt'
      | 'doc'
      | 'xls'
      | 'ppt'
      | 'docx'
      | 'xlsx'
      | 'pptx'
      | 'pdf'
      | 'png'
      | 'mp4'
      | 'jpeg'
      | 'jpg'
      | 'mov'
    )[];
  };
}

export interface SchemaFieldArray extends BaseField {
  fieldType: 'ARRAY';
  initialValue: any[];
  child: Schema[];
  meta?: Partial<MetaField>;
}

export interface SchemaFieldPhone extends BaseField {
  fieldType: 'PHONE';
  initialValue: '';
  meta?: Partial<MetaField>;
}

export interface SchemaFieldCustom extends BaseField {
  fieldType: 'CUSTOM';
  initialValue: any;
  meta?: Partial<MetaField>;
}

export type SchemaField =
  | SchemaFieldCustom
  | SchemaFieldText
  | SchemaFieldTextArea
  | SchemaFieldWyswyg
  | SchemaFieldCheckbox
  | SchemaFieldRadio
  | SchemaFieldDropdown
  | SchemaFieldDropdownAsync
  | SchemaFieldCounter
  | SchemaFieldSwitch
  | SchemaFieldFile
  | SchemaFieldDate
  | SchemaFieldPhone
  | SchemaFieldDateRange
  | SchemaFieldArray;

// FORMNAME_VARIANT_FIELDNAME
