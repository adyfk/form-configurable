import { ClassName, ExpressionString } from './core';
import { SchemaField } from './field';

interface BaseStyle {
  container: ClassName;
  content: ClassName;
  badge: ClassName;
}

interface BaseProp {
  name: 'editable' | 'show';
  value?: any;
  expression?: ExpressionString | null;
}

interface SchemaBase {
  key?: string;
  style?: Partial<BaseStyle>;
  props?: BaseProp[];
}

export interface SchemaGroupType extends SchemaBase {
  variant: 'GROUP';
  section?: string;
  meta: Partial<{
    title: string;
    subtitle: string;
    tooltip: string;
    hint: string;
    badge: string;
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
  }>;
}

export type SchemaFieldType = {
  variant: 'FIELD';
} & SchemaBase &
  SchemaField;

export type Schema = SchemaGroupType | SchemaViewType | SchemaFieldType;
