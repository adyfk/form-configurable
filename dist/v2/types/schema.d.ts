import { ISchemaCore } from "./core";
import { ISchemaFieldDefault, ISchemaFieldArrayDefault, ISchemaFieldObjectDefault } from "./field";
import { ISchemaGroupDefault } from "./group";
import { ISchemaViewDefault } from "./view";
export interface IOverrideSchema extends ISchemaCore {
    comopnent: string;
}
export type INativeSchema = ISchemaFieldDefault | ISchemaFieldArrayDefault | ISchemaFieldObjectDefault | ISchemaGroupDefault | ISchemaViewDefault;
export type ISchema = INativeSchema;
