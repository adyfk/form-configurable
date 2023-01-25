import { SchemaBase } from './core';
import { Schema } from './schema';

interface MetaGroup {
  title: string;
  subtitle: string;
  tooltip: string;
  hint: string;
  badge: string;
  [key: string]: any;
}

interface BaseGroup extends SchemaBase {
  variant: 'GROUP';
  child: Schema[];
  name?: string;
  data?: any;
}

export interface SchemaGroupAccordion extends BaseGroup {
  groupType: 'ACCORDION';
  meta: Partial<MetaGroup>;
}

export interface SchemaGroupDefault extends BaseGroup {
  groupType: 'DEFAULT';
  meta: Partial<MetaGroup>;
}
export interface SchemaGroupCounter extends BaseGroup {
  groupType: 'COUNTER';
  meta: Partial<MetaGroup>;
}

export interface SchemaGroupCustom extends BaseGroup {
  groupType: 'CUSTOM';
  meta: Partial<MetaGroup>;
}

export type SchemaGroup = SchemaGroupDefault | SchemaGroupCustom | SchemaGroupAccordion;
