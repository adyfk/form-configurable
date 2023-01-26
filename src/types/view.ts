import { SchemaBase } from './core';

interface MetaView {
  title: string;
  subtitle: string;
  [key: string]: any;
}

interface BaseView extends SchemaBase {
  variant: 'VIEW';
  name?: string;
  data?: any;
}

export interface SchemaViewField extends BaseView {
  viewType: 'FIELD';
  fieldType:
    | 'TEXT'
    | 'NUMBER'
    | 'CURRENCY'
    | 'WYSWYG'
    | 'TEXTAREA'
    | 'CHECKBOX'
    | 'RADIO'
    | 'DROPDOWN'
    | 'DATE'
    | 'FILE'
    | 'SWITCH'
    | 'CUSTOM'
  meta?: Partial<MetaView>;
}

export interface SchemaViewHelper extends BaseView {
  viewType: 'HELPER';
  helperType: 'DIVIDER' | string;
  meta?: Partial<MetaView>;
}

export interface SchemaViewDefault extends BaseView {
  viewType: 'DEFAULT';
  meta?: Partial<MetaView>;
}

export interface SchemaViewCustom extends BaseView {
  viewType: 'CUSTOM';
  meta?: Partial<MetaView>;
}

export type SchemaView = SchemaViewField | SchemaViewHelper | SchemaViewCustom | SchemaViewDefault;
