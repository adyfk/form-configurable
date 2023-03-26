/// <reference types="react" />
import { ISchema } from "../types";
interface IFormGeneratorProps {
    schemas: any[];
    parent: string;
    fallback: any;
    fallbackVariantNotRegistered: any;
    fallbackComponentNotRegisterd: any;
}
interface ISchemaComponentProps extends Omit<IFormGeneratorProps, "schemas"> {
    schema: ISchema;
}
export declare function SchemaComponent({ schema, parent, fallback, fallbackVariantNotRegistered, fallbackComponentNotRegisterd, }: ISchemaComponentProps): any;
export declare function FormGenerator(props: Partial<IFormGeneratorProps>): JSX.Element;
export default FormGenerator;
