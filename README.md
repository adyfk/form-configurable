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

```tsx
import { FieldType, ValueType } from 'gateway/field';
import useForm from '../client/useForm';

const useFormTest = () => {
  const { control, fields, formState, handleSubmit } = useForm({
    schema: [
      {
        fieldName: 'firstValue',
        fieldType: FieldType.TEXT,
        valueType: ValueType.NUMBER,
        config: [],
        initialValue: '',
        meta: {
          label: 'First Value',
          placeholder: 'Input Number',
        },
        style: {},
        rules: [
          {
            error: 'required',
            expression: '!firstValue',
          },
          {
            error: 'should lower than second value',
            expression: 'firstValue > secondValue',
          },
        ],
      },
      {
        fieldName: 'secondValue',
        fieldType: FieldType.TEXT,
        valueType: ValueType.NUMBER,
        config: [
          { name: 'hidden', expression: '!firstName' },
          { name: 'disabled', expression: 'firstValue > secondValue' },
        ],
        initialValue: '',
        meta: {
          label: 'Second Value',
          placeholder: 'Input Number',
        },
        rules: [{ expression: '!secondValue', error: 'required' }],
        style: {},
      },
      {
        fieldName: 'result',
        fieldType: FieldType.TEXT,
        valueType: ValueType.NUMBER,
        config: [{ name: 'disabled', value: true }],
        initialValue: 0,
        meta: {
          label: 'Result',
          placeholder: 'result',
        },
        style: {},
        rules: [],
        override: {
          self: 'firstValue + secondValue',
        },
      },
    ],
  });

  return {
    control,
    fields,
    formState,
    handleSubmit,
  };
};

export default useFormTest;
```

### App.tsx

```tsx
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useField } from 'form-configurable/client';
import useFormTest from './useFormTest';
import { FieldProps } from 'form-configurable/client';

const TRANSFORM: Record<string, any> = {
  number: (value: any) => +value || parseInt(value) || 0,
};

function Field({ name, control, field }: FieldProps) {
  const { value, touched, error, disabled, hidden, onChange, onBlur } =
    useField({
      control,
      name,
    });

  if (hidden) return <></>;

  if (field.fieldType === 'text') {
    const onChangeField = (value: any) => {
      const result = TRANSFORM[field.valueType](value);
      onChange(result);
    };

    return (
      <Box key={field.fieldName}>
        <TextField
          fullWidth
          disabled={disabled}
          onBlur={onBlur}
          onChange={(e) => onChangeField(e.target.value)}
          label={field.label}
          value={value}
          helperText={touched && error}
        />
      </Box>
    );
  }
  return <>Custom Field Field</>;
}

function App() {
  const { control, fields, formState, handleSubmit } = useFormTest();

  const onSubmit = (...args: any) => console.log('submit', ...args);
  const onSubmitInvalid = (...args: any) => console.log('invalid', ...args);

  return (
    <Box display={'flex'} justifyContent="center">
      <form onSubmit={handleSubmit(onSubmit, onSubmitInvalid)}>
        <Typography py={2}>Demo Form Configurable</Typography>
        <Grid container gap={2} width={500}>
          <Grid item xs={12} textAlign="center">
            <Button
              disabled={formState.isSubmitting}
              type="submit"
              variant="outlined"
            >
              Submit
            </Button>
          </Grid>
          {fields.map((field) => {
            return (
              <Grid key={field.fieldName} item lg={12} md={12}>
                <Field control={control} name={field.fieldName} field={field} />
              </Grid>
            );
          })}
        </Grid>
      </form>
    </Box>
  );
}

export default App;
```

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
