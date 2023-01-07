import { ExpressionString } from './core';

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

interface BaseField {
  initialValue: any;
  fieldName: string;
  override?: Partial<BaseOverride>;
  rules?: BaseRule[];
}

interface SchemaTextField extends BaseField {
  fieldType: 'TEXT';
  valueType: 'STRING' | 'NUMBER';
  meta?: Partial<MetaField>;
}

interface SchemaHiddenField extends BaseField {
  fieldType: 'HIDDEN';
  meta?: Partial<MetaField>;
}

interface SchemaTextAreaField extends BaseField {
  fieldType: 'TEXTAREA';
  valueType: 'STRING';
  meta?: Partial<MetaField> & Partial<{ rows: number; cols: number }>;
}

interface SchemaWysywgField extends BaseField {
  fieldType: 'WYSWYG';
  valueType: 'STRING';
  meta?: Partial<MetaField> & Partial<{ rows: number; cols: number }>;
}

interface SchemaOptionField extends BaseField {
  fieldType: 'DROPDOWN' | 'CHECKBOX' | 'RADIO';
  valueType: 'NUMBER' | 'STRING' | 'OBJECT';
  meta?: Partial<MetaField> & {
    options: any[];
    asObject?: boolean;
    attrId?: string;
    attrLabel?: string;
  };
}

interface SchemaDateField extends BaseField {
  fieldType: 'DATE';
  valueType: 'DATE';
  meta?: Partial<MetaField> & {
    dateFormat: string;
    view: ('month' | 'year')[];
  };
}

interface SchemaTimeField extends BaseField {
  fieldType: 'TIME';
  valueType: 'DATE';
  meta?: Partial<MetaField>;
}

interface SchemaFileField extends BaseField {
  fieldType: 'FILE';
  valueType: 'ARRAY_OBJECT';
  meta?: Partial<MetaField> & {
    attrId: string;
    attrLabel: string;
  };
}

interface SchemaCustomField extends BaseField {
  fieldType: 'CUSTOM';
  meta: Partial<MetaField> & Record<string, any>;
}

export type SchemaField =
  | SchemaTextField
  | SchemaTextAreaField
  | SchemaWysywgField
  | SchemaOptionField
  | SchemaFileField
  | SchemaDateField
  | SchemaTimeField
  | SchemaCustomField
  | SchemaHiddenField;
