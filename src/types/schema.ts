import { SchemaBase } from './core';
import { SchemaField } from './field';

export interface SchemaGroupType extends SchemaBase {
  variant: 'GROUP';
  section?: string;
  meta: Partial<{
    title: string;
    subtitle: string;
    tooltip: string;
    hint: string;
    badge: string;
    [key: string]: any;
  }>;
  child: Schema[];
}

export interface SchemaViewType extends SchemaBase {
  variant: 'VIEW';
  section?: string;
  meta: Partial<{
    title: string;
    subtitle: string;
    tooltip: string;
    hint: string;
    badge: string;
    [key: string]: any;
  }>;
}

export type SchemaFieldType = SchemaField;

export type Schema = SchemaGroupType | SchemaViewType | SchemaFieldType;
