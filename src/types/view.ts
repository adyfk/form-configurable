import { SchemaBase } from './core';

interface MetaView {
  title: string;
  subtitle: string;
  infoTooltip: string;
  warningTooltip: string;
  dangerTooltip: string;
  htmlTooltip: string;
  helperText: string;
  badge: string;
  children: string;
  [key: string]: any;
}

interface BaseView extends SchemaBase {
  variant: 'VIEW';
  name?: string;
  data?: any;
}

export interface SchemaViewFieldText extends BaseView {
  viewType: 'FIELD-TEXT';
  meta?: Partial<MetaView> & Partial<{
    prefix: string;
    suffix: string;
  }>;
}

export interface SchemaViewFieldDate extends BaseView {
  viewType: 'FIELD-DATE',
  meta?: Partial<MetaView> & Partial<{
    format: string;
  }>;
}

export interface SchemaViewFieldCurrency extends BaseView {
  viewType: 'FIELD-CURRENCY',
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

export type SchemaView = SchemaViewField | SchemaViewDivider | SchemaViewCustom;
