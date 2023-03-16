import { ExpressionString, SchemaBase } from './core';
import { Schema } from './schema';
export interface MetaField {
    placeholder: string;
    label: string;
    suffix: string;
    prefix: string;
    optional: boolean;
    required: boolean;
    infoTooltip: string;
    warningTooltip: string;
    dangerTooltip: string;
    htmlTooltip: string;
    helperText: string;
    badge: string;
    [key: string]: any;
}
interface BaseRule {
    expression: ExpressionString;
    error?: string;
    catch?: string;
}
interface BaseOverride {
    self: ExpressionString;
    others: Record<string, any>;
}
export interface IOption {
    label: string;
    value: any;
    other?: boolean;
}
interface BaseField extends SchemaBase {
    variant: 'FIELD';
    initialValue?: any;
    name: string;
    override?: Partial<BaseOverride>;
    rules?: BaseRule[];
}
export interface SchemaFieldText extends BaseField {
    fieldType: 'TEXT';
    valueType: 'STRING' | 'NUMBER';
    initialValue?: string | number;
    meta?: Partial<MetaField>;
}
export interface SchemaFieldTextArea extends BaseField {
    fieldType: 'TEXTAREA';
    valueType: 'STRING';
    initialValue?: string;
    meta?: Partial<MetaField> & Partial<{
        rows: number;
        cols: number;
    }>;
}
export interface SchemaFieldWyswyg extends BaseField {
    fieldType: 'WYSWYG';
    valueType: 'STRING';
    initialValue?: string;
    meta?: Partial<MetaField> & Partial<{
        rows: number;
        cols: number;
    }>;
}
export interface SchemaFieldCheckbox extends BaseField {
    fieldType: 'CHECKBOX';
    initialValue?: IOption[];
    meta?: Partial<MetaField> & {
        options: IOption[];
        row?: boolean;
        other?: boolean;
    };
}
export interface SchemaFieldRadio extends BaseField {
    fieldType: 'RADIO';
    initialValue?: IOption;
    meta?: Partial<MetaField> & {
        options: IOption[];
        row?: boolean;
        other?: boolean;
    };
}
export interface SchemaFieldDropdown extends BaseField {
    fieldType: 'DROPDOWN';
    initialValue?: IOption;
    meta?: Partial<MetaField> & {
        options: IOption[];
        other?: boolean;
    };
}
export interface SchemaFieldDropdownAsync extends BaseField {
    fieldType: 'DROPDOWN-ASYNC';
    initialValue?: IOption;
    meta?: Partial<MetaField> & {
        optionUrl: string;
        other?: boolean;
    };
}
export interface SchemaFieldCounter extends BaseField {
    fieldType: 'COUNTER';
    initialValue?: number;
    meta?: Partial<MetaField> & {
        min?: number;
        max?: number;
    };
}
export interface SchemaFieldSwitch extends BaseField {
    fieldType: 'SWITCH';
    initialValue?: IOption;
    meta?: Partial<MetaField> & {
        options: [
            {
                value: true;
                label: string;
            },
            {
                value: false;
                label: string;
            }
        ];
    };
}
export interface SchemaFieldDate extends BaseField {
    fieldType: 'DATE';
    valueType: 'DATE';
    meta?: Partial<MetaField> & {
        format: string;
        variant: 'date' | 'month' | 'year' | 'time' | 'month-year' | 'date-month-year' | 'date-month-year-time';
    };
}
export interface SchemaFieldDateRange extends BaseField {
    fieldType: 'DATERANGE';
    valueType: 'DATE';
    meta?: Partial<MetaField> & {
        format: string;
    };
    initialValue?: {
        start: string;
        end: string;
    };
}
export interface SchemaFieldDateTimeRange extends BaseField {
    fieldType: 'DATE-TIME-RANGE';
    valueType: 'DATE';
    meta?: Partial<MetaField> & {
        format: string;
    };
    initialValue?: {
        start: string;
        end: string;
    };
}
export interface SchemaFieldFile extends BaseField {
    fieldType: 'FILE';
    initialValue?: Partial<{
        [key: string]: any;
        fileId: string;
        fileName: string;
        fileUrl: string;
        fileSize: number | string;
        fileCategory: string;
        fileExtension: string;
    }>[];
    meta?: Partial<MetaField> & {
        description?: string;
        uploadUrl?: string;
        maxFile?: number;
        maxSize?: number;
        allowExtension?: ('txt' | 'doc' | 'xls' | 'ppt' | 'docx' | 'xlsx' | 'pptx' | 'pdf' | 'png' | 'mp4' | 'jpeg' | 'jpg' | 'mov')[];
    };
}
export interface SchemaFieldArray extends BaseField {
    fieldType: 'ARRAY';
    component: string;
    initialValue?: any[];
    child: Schema[];
    meta?: Partial<MetaField>;
}
export interface SchemaFieldPhone extends BaseField {
    fieldType: 'PHONE';
    initialValue?: '';
    meta?: Partial<MetaField> & Partial<{
        country: string;
    }>;
}
export interface SchemaFieldObject extends BaseField {
    fieldType: 'OBJECT';
    initialValue?: any;
    component: string;
    child: Schema[];
    meta?: Partial<MetaField>;
}
export interface SchemaFieldCustom extends BaseField {
    fieldType: 'CUSTOM';
    initialValue?: any;
    component: string;
    meta?: Partial<MetaField>;
}
export type SchemaField = SchemaFieldCustom | SchemaFieldText | SchemaFieldTextArea | SchemaFieldWyswyg | SchemaFieldCheckbox | SchemaFieldRadio | SchemaFieldDropdown | SchemaFieldDropdownAsync | SchemaFieldCounter | SchemaFieldSwitch | SchemaFieldFile | SchemaFieldDate | SchemaFieldPhone | SchemaFieldDateRange | SchemaFieldArray | SchemaFieldObject | SchemaFieldDateTimeRange;
export {};
