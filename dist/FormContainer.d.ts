import { FC } from 'react';
import type { Schema, SchemaGroup, SchemaView, SchemaField, SchemaFieldArray } from './types';
import type { Form } from './logic/createForm';
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
    form?: Form;
    value: any[];
    container: FC<{
        item: number;
        data: any;
        children: any;
    }>;
    children?: any;
}>;
export type FieldArrayProps = FC<{
    form?: Form;
    config: SchemaFieldArray;
    child: FieldArrayChildProps;
    [key: string]: any;
}>;
export declare const mapConfigChildArray: ({ config, index }: {
    config: SchemaFieldArray;
    index: number | string;
}) => Schema[];
export declare function FormContainer({ form, schema, Group, View, Field, FieldArray, ...otherProps }: {
    schema: Schema[];
    form?: Form;
    Group: GroupProps;
    View: ViewProps;
    Field: FieldProps;
    FieldArray?: FieldArrayProps;
    [key: string]: any;
}): JSX.Element;
export default FormContainer;
