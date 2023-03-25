/// <reference types="react" />
import { ISchema } from "../types";
export type Component<T> = (_props: {
    schema: T;
}) => any;
export type ComponentGroup<T> = (_props: {
    schema: T;
    schemas: ISchema[];
    children: any;
}) => any;
export type ComponentArray<T> = (_props: {
    schema: T;
    schemas: ISchema[];
    children: (_propsChildren: {
        value: any[];
        container: (_propsContainer: {
            data: any;
            children: any;
        }) => any;
    }) => any;
}) => any;
export type ComponentObject<T> = (_props: {
    schema: T;
    schemas: ISchema[];
    children: (_propsChildren: {
        value: Record<string, any>;
        container: (_propsContainer: {
            data: any;
            children: any;
        }) => any;
    }) => any;
}) => any;
export type Components = {
    FIELD: Record<string, Component<any>>;
    VIEW: Record<string, Component<any>>;
    GROUP: Record<string, ComponentGroup<any>>;
    "FIELD-ARRAY": Record<string, ComponentArray<any>>;
    "FIELD-OBJECT": Record<string, ComponentObject<any>>;
};
declare const ComponentContext: import("react").Context<{
    components: Components;
}>;
export default ComponentContext;
