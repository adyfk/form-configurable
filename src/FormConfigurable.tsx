/* eslint-disable array-callback-return */
import { FC } from 'react';

import type {
  Schema,
  SchemaGroupType,
  SchemaViewType,
  SchemaFieldType,
} from './types/schema';

import type { Form } from './logic/createForm';

export type GroupType = FC<{
  form?: Form;
  config: SchemaGroupType;
  child: any;
}>;

export type ViewType = FC<{
  form?: Form;
  config: SchemaViewType;
}>;

export type FieldType = FC<{
  form?: Form;
  config: SchemaFieldType;
}>;

export const FormContainer = ({
  form,
  schema,
  Group,
  View,
  Field,
  ...otherProps
}: {
  schema: Schema[];
  form?: Form;
  Group: GroupType;
  View: ViewType;
  Field: FieldType;
  [key: string]: any;
}) => {
  return (
    <>
      {schema.map(function (config) {
        if (config.variant === 'GROUP') {
          return (
            <Group
              key={config.key}
              form={form}
              config={config}
              child={(props: any) => {
                return (
                  <FormContainer
                    Group={Group}
                    View={View}
                    Field={Field}
                    schema={config.child}
                    form={form}
                    {...otherProps}
                    {...props}
                  />
                );
              }}
              {...otherProps}
            />
          );
        } else if (config.variant === 'VIEW') {
          return (
            <View
              key={config.key}
              form={form}
              config={config}
              {...otherProps}
            />
          );
        } else if (config.variant === 'FIELD') {
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
};

const FormConfigurable: FC<{
  schema: Schema[];
  form: Form;
  Group: GroupType;
  View: ViewType;
  Field: FieldType;
  parent?: any;
  [key: string]: any;
}> = (props) => {
  return <FormContainer {...props} />;
};

export default FormConfigurable;
