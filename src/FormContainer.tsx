/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */

import { FC } from 'react';

import type {
  Schema, SchemaGroup, SchemaView, SchemaField, SchemaFieldArray,
} from './types';

import type { Form } from './logic/createForm';
import createPath from './utils/createPath';
// import useField from './useField';

export type GroupProps = FC<{
  form?: Form;
  config: SchemaGroup;
  child: any;
}>;

export type ViewProps = FC<{
  form?: Form;
  config: SchemaView;
}>;

export type FieldProps = FC<{
  form?: Form;
  config: SchemaField;
}>;

export type FieldArrayProps = FC<{
  form?: Form;
  config: SchemaField;
}>

export const mapConfigChildArray = ({ config, index }: {
  config: SchemaFieldArray;
  index: number | string;
}) => config.child.map((childConfig) => {
  const childConfigOverride = childConfig;
  Object.assign(childConfigOverride, {
    key: `${childConfigOverride.key}_${index}`,
  });

  if (childConfig.variant === 'FIELD') {
    Object.assign(childConfigOverride, {
      fieldName: createPath({
        parent: config.fieldName,
        index,
        child: childConfig.fieldName,
      }),
    });
  }
  return childConfigOverride as Schema;
});

export function FormContainer({
  form,
  schema,
  Group,
  View,
  Field,
  ...otherProps
}: {
  schema: Schema[];
  form?: Form;
  Group: GroupProps;
  View: ViewProps;
  Field: FieldProps;
  [key: string]: any;
}) {
  return (
    <>
      {schema.map((config) => {
        if (config.variant === 'GROUP') {
          return (
            <Group
              key={config.key}
              form={form}
              config={config}
              child={(props: any) => (
                <FormContainer
                  Group={Group}
                  View={View}
                  Field={Field}
                  schema={config.child}
                  form={form}
                  {...otherProps}
                  {...props}
                />
              )}
              {...otherProps}
            />
          );
        } if (config.variant === 'VIEW') {
          return (
            <View
              key={config.key}
              form={form}
              config={config}
              {...otherProps}
            />
          );
        }
        if (config.variant === 'FIELD') {
          return (
            <Field
              key={config.key}
              form={form}
              config={config}
              {...otherProps}
            />
          );
        }
      })}
    </>
  );
}

export default FormContainer;
