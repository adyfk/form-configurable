import { SchemaBase } from './core';
import { Schema } from './schema';

interface MetaGroup {
  title: string;
  subtitle: string;
  infoTooltip: string;
  warningTooltip: string;
  dangerTooltip: string;
  htmlTooltip: string;
  helperText: string;
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

export interface SchemaGroupCard extends BaseGroup {
  groupType: 'CARD';
  meta: Partial<MetaGroup> & {
    border?: boolean;
    shadow?: boolean;
  };
}

export interface SchemaGroupCustom extends BaseGroup {
  groupType: 'CUSTOM';
  component: string;
  meta: Partial<MetaGroup>;
}

export type SchemaGroup = SchemaGroupCustom | SchemaGroupAccordion | SchemaGroupCard;
