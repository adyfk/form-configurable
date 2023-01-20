/* eslint-disable array-callback-return */

import { FC } from 'react';

import type {
  Schema, SchemaGroup, SchemaView, SchemaField,
} from './types';

import type { Form } from './logic/createForm';

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
        } if (config.variant === 'FIELD') {
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

const FormConfigurable: FC<{
  schema: Schema[];
  form: Form;
  Group: GroupProps;
  View: ViewProps;
  Field: FieldProps;
  parent?: any;
  [key: string]: any;
}> = (props) => <FormContainer {...props} />;

export default FormConfigurable;
