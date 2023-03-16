import { SchemaField } from './field';
import { SchemaGroup } from './group';
import { SchemaView } from './view';
export type Schema = SchemaGroup | SchemaView | SchemaField;
