/// <reference types="react" />
import { ISchema, ISchemaCore } from "../types";
export declare function SchemaComponent({ schemas, schema, parent, fallback, fallbackVariantNotRegistered, fallbackComponentNotRegisterd, }: {
    schemas: ISchema[];
    schema: ISchemaCore;
    parent: string;
    fallback?: any;
    fallbackVariantNotRegistered?: any;
    fallbackComponentNotRegisterd?: any;
}): any;
export declare function FormGenerator(props: {
    schemas?: any[];
    parent?: string;
    fallback?: any;
    fallbackVariantNotRegistered?: any;
    fallbackComponentNotRegisterd?: any;
}): JSX.Element;
export default FormGenerator;
