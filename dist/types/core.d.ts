export type ExpressionString = string;
export type ClassName = string;
export interface BaseStyle {
    container: any;
    content: any;
    badge: any;
    [key: string]: any;
}
export interface BaseProp {
    name: 'editable' | 'show' | string;
    value?: any;
    expression?: ExpressionString | null;
}
export interface SchemaBase {
    data?: any;
    name?: string;
    key?: string;
    style?: Partial<BaseStyle>;
    props?: BaseProp[];
}
