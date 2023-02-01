/* eslint-disable react/no-array-index-key */
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
  // eslint-disable-next-line no-unused-vars
  child: (args:{ value: any[], container: any; }) => any;
}>

export const mapConfigChildArray = ({ config, index }: {
  config: SchemaFieldArray;
  index: number | string;
}) => config.child.map((childConfig) => {
  const childConfigOverride = { ...childConfig };
  Object.assign(childConfigOverride, {
    key: `${childConfigOverride.key}_${index}`,
  });

  if (childConfig.variant === 'FIELD') {
    Object.assign(childConfigOverride, {
      name: createPath({
        parent: config.name,
        index,
        child: childConfig.name,
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
  FieldArray,
  ...otherProps
}: {
  schema: Schema[];
  form?: Form;
  Group: GroupProps;
  View: ViewProps;
  Field: FieldProps;
  FieldArray?: FieldArrayProps;
  [key: string]: any;
}) {
  return (
    <>
      {schema.map((config) => {
        const key = config.name || config.key;
        if (config.variant === 'GROUP') {
          return (
            <Group
              key={key}
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
              key={key}
              form={form}
              config={config}
              {...otherProps}
            />
          );
        }
        if (config.variant === 'FIELD') {
          if (config.fieldType === 'ARRAY' && !!FieldArray) {
            return (
              <FieldArray
                key={key}
                form={form}
                config={config}
                child={({ value, container: Container }) => value.map((_: any, index: any) => (
                  <Container key={key + index}>
                    <FormContainer
                      Group={Group}
                      View={View}
                      Field={Field}
                      FieldArray={FieldArray}
                      schema={mapConfigChildArray({ config, index })}
                      form={form}
                      {...otherProps}
                    />
                  </Container>
                ))}
              />
            );
          }

          return (
            <Field
              key={key}
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
