/* eslint-disable react/no-array-index-key */
/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */

import { FC } from 'react';

import type {
  Schema, SchemaGroup, SchemaView, SchemaField, SchemaFieldArray,
} from './types';

import type { Form } from './logic/createForm';
import createPath from './utils/createPath';
import generateId from './utils/generateId';
// import useField from './useField';

export type GroupProps = FC<{
  form?: Form;
  config: SchemaGroup;
  child: any;
  [key: string]: any;
}>;

export type ViewProps = FC<{
  form?: Form;
  config: SchemaView;
  [key: string]: any;
}>;

export type FieldProps = FC<{
  form?: Form;
  config: SchemaField;
  [key: string]: any;
}>;

export type FieldArrayChildProps = FC<{
  value: any[];
  container: FC<{ item: number; data: any; children: any; }>;
  children?: any
}>;

export type FieldArrayProps = FC<{
  form?: Form;
  config: SchemaFieldArray;
  // eslint-disable-next-line no-unused-vars
  child: FieldArrayChildProps;
  [key: string]: any;
}>

export const mapConfigChildArray = ({ config, index }: {
  config: SchemaFieldArray;
  index: number | string;
}) => config.child.map((childConfig) => {
  const childConfigOverride = { ...childConfig };
  Object.assign(childConfigOverride, {
    key: `${childConfigOverride.key}_${index}`,
  });

  if (childConfigOverride.variant === 'FIELD') {
    Object.assign(childConfigOverride, {
      name: createPath({
        parent: config.name,
        index,
        child: childConfig.name,
      }),
      meta: {
        ...childConfigOverride.meta,
        label: childConfigOverride.meta?.label?.replace('__ITEM__', `${+index + 1}`),
      },
    });
  }
  if (childConfigOverride.variant === 'GROUP') {
    Object.assign(childConfigOverride, {
      child: mapConfigChildArray({ config, index }),
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
        const key = config.name || config.key || generateId();
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
                  FieldArray={FieldArray}
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
                child={({ value, container: Container }) => (
                  <>
                    {value.map((data: any, index: number) => (
                      <Container key={key + index} item={index} data={data}>
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
                  </>
                )}
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
