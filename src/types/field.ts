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

export interface IOption {
  label: string;
  value: any;
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

export interface SchemaFieldCheckbox extends BaseField {
  fieldType: 'CHECKBOX';
  valueType: IOption[];
  meta?: Partial<MetaField> & {
    options: IOption[];
    row?: boolean;
    other?: boolean;
  };
}

export interface SchemaFieldRadio extends BaseField {
  fieldType: 'RADIO';
  valueType: IOption;
  meta?: Partial<MetaField> & {
    options: IOption[];
    row?: boolean;
    other?: boolean;
  };
}

export interface SchemaFieldDropdown extends BaseField {
  fieldType: 'DROPDOWN';
  valueType: IOption;
  meta?: Partial<MetaField> & {
    options: IOption[];
    other?: boolean;
  };
}

export interface SchemaFieldDropdownAsync extends BaseField {
  fieldType: 'DROPDOWN-ASYNC';
  valueType: IOption;
  meta?: Partial<MetaField> & {
    optionUrl: string;
    other?: boolean;
  };
}

export interface SchemaFieldCounter extends BaseField {
  fieldType: 'COUNTER';
  meta?: Partial<MetaField> & {
    min?: number;
    max?: number;
  };
}

export interface SchemaFieldSwitch extends BaseField {
  fieldType: 'SWITCH';
  valueType: boolean;
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
    maxSize: number; // mb
    allowExtension: (
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

export interface SchemaFieldCustom extends BaseField {
  fieldType: 'CUSTOM';
  meta: Partial<MetaField> & Record<string, any>;
}

export type SchemaField =
  | SchemaFieldText
  | SchemaFieldTextArea
  | SchemaFieldWyswyg
  | SchemaFieldCheckbox
  | SchemaFieldRadio
  | SchemaFieldDropdown
  | SchemaFieldDropdownAsync
  | SchemaFieldCounter
  | SchemaFieldFile
  | SchemaFieldDate
  | SchemaFieldDateRange
  | SchemaFieldCustom
  | SchemaFieldHidden;

// FORMNAME_VARIANT_FIELDNAME
