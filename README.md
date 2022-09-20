[TOC]

# React Form Configurable

making applications the laziest is to create a form where we need to make validation on the frontend and backend, not to mention match the conditions between the two. form-configurable helps standardize the schema-based generator that can be configured from the backend

## Features

- Build customizable forms with high performance
- Using validation and overriding expressions
- Out of the box integration with UI libraries

## [Demo](https://form-configurable.netlify.app)

## Install

```bash
    npm i form-configurable
```

## Quick Start

create two files and name them userForm Test.ts and App.tsx

### useFormTest.ts

## Type Schema Field

```ts
export type ExpressionString = string;

export enum FieldType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  WYSWYG = 'WYSWYG',
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
  DROPDOWN = 'DROPDOWN',
  FILE = 'FILE',
  DATE = 'DATE',
  TIME = 'TIME',
  PHONE = 'PHONE',
}

export enum ValueType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
  DATE = 'DATE',
}

interface BaseMeta {
  placeholder: string;
  label: string;
  suffix: string;
  prefix: string;
  tooltip: string;
  hint: string;
  badge: string;
}

interface BaseStyle {
  width: Partial<{
    sm: any;
    md: any;
    lg: any;
  }>;
  badge: Partial<{
    color: string;
    bgcolor: string;
  }>;
  fullWidth: boolean;
}

interface BaseField {
  initialValue: any;
  fieldName: string;
  meta: Partial<BaseMeta>;
  style: Partial<BaseStyle>;
  config: {
    name: 'disabled' | 'hidden';
    value?: any;
    expression?: ExpressionString | null;
  }[];
  rules: {
    expression: ExpressionString;
    error: string;
  }[];
  override?: Partial<{
    self: ExpressionString;
    // event when onchange self field
    resetValues: Record<string, any>;
  }>;
}

interface Option {
  label: string;
  value: string | number | Record<string, any>;
}

interface SchemaTextField extends BaseField {
  fieldType: FieldType.TEXT;
  valueType: ValueType.STRING | ValueType.NUMBER;
}

interface SchemaTextAreaField extends Omit<BaseField, 'meta'> {
  fieldType: FieldType.TEXTAREA;
  valueType: ValueType.STRING;
  meta: Partial<BaseMeta> & { rows?: number; cols?: number };
}

interface SchemaWysywgField extends Omit<BaseField, 'meta'> {
  fieldType: FieldType.WYSWYG;
  valueType: ValueType.STRING;
  meta: Partial<BaseMeta> & { rows?: number; cols?: number };
}

interface SchemaOptionField extends Omit<BaseField, 'meta'> {
  fieldType: FieldType.DROPDOWN | FieldType.CHECKBOX | FieldType.RADIO;
  valueType: ValueType.NUMBER | ValueType.STRING | ValueType.OBJECT;
  meta: Partial<BaseMeta> & {
    attrId?: string;
    attrLabel?: string;
    options: Option[];
  };
}

interface SchemaDateField extends Omit<BaseField, 'meta'> {
  fieldType: FieldType.DATE;
  valueType: ValueType.DATE;
  meta: Partial<BaseMeta> & {
    format: string;
    view: ('month' | 'year')[];
  };
}
interface SchemaTimeField extends BaseField {
  fieldType: FieldType.TIME;
  valueType: ValueType.DATE;
}

interface SchemaFileField extends Omit<BaseField, 'meta'> {
  fieldType: FieldType.FILE;
  valueType: ValueType.ARRAY;
  meta: Partial<BaseMeta> & {
    attrId: string;
    attrLabel: string;
  };
}
export type SchemaField =
  | SchemaTextField
  | SchemaTextAreaField
  | SchemaWysywgField
  | SchemaOptionField
  | SchemaFileField
  | SchemaDateField
  | SchemaTimeField;
```

## [Expression Parser Operator](https://form-configurable.netlify.app)

### Contributors

Thanks go to these wonderful people! [[Become a contributor](CONTRIBUTING.md)].

<a href="https://github.com/adyfk/form-configurable/graphs/contributors">
  <img src="https://opencollective.com/react-form-schema/contributors.svg?width=890&button=false" />
</a>
