import { SchemaBase } from './core';
export interface MetaView {
    title: string;
    subtitle: string;
    infoTooltip: string;
    warningTooltip: string;
    dangerTooltip: string;
    htmlTooltip: string;
    helperText: string;
    badge: string;
    children: string;
    variant: string;
    [key: string]: any;
}
interface BaseView extends SchemaBase {
    variant: 'VIEW';
    name?: string;
}
export interface SchemaViewText extends BaseView {
    viewType: 'TEXT';
    meta?: Partial<MetaView> & Partial<{
        prefix: string;
        suffix: string;
    }>;
}
export interface SchemaViewFieldText extends BaseView {
    viewType: 'FIELD-TEXT';
    meta?: Partial<MetaView> & Partial<{
        prefix: string;
        suffix: string;
    }>;
}
export interface SchemaViewFieldDate extends BaseView {
    viewType: 'FIELD-DATE';
    meta?: Partial<MetaView> & Partial<{
        format: string;
    }>;
}
export interface SchemaViewFieldCurrency extends BaseView {
    viewType: 'FIELD-CURRENCY';
    meta?: Partial<MetaView>;
}
type SchemaViewField = SchemaViewFieldText | SchemaViewFieldDate | SchemaViewFieldCurrency;
export interface SchemaViewDivider extends BaseView {
    viewType: 'DIVIDER';
    meta?: Partial<MetaView> & Partial<{
        textAlign: string;
        children: string;
        variant: string;
        orientation: string;
    }>;
}
export interface SchemaViewCustom extends BaseView {
    viewType: 'CUSTOM';
    component: string;
    meta?: Partial<MetaView>;
}
export interface SchemaViewFieldOption extends BaseView {
    viewType: 'FIELD-OPTION';
    meta?: Partial<MetaView> & Partial<{
        prefix: string;
        suffix: string;
    }>;
}
export interface SchemaViewFieldMultipleOption extends BaseView {
    viewType: 'FIELD-MULTIPLE-OPTION';
    meta?: Partial<MetaView> & Partial<{
        prefix: string;
        suffix: string;
    }>;
}
export type SchemaView = SchemaViewText | SchemaViewField | SchemaViewDivider | SchemaViewCustom | SchemaViewFieldOption | SchemaViewFieldMultipleOption;
export {};
