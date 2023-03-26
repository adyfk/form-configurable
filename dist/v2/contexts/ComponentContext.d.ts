/// <reference types="react" />
export type IComponentContainer<T = any> = (_propsContainer: {
    data: any;
    children: any;
    schema: T;
}) => any;
export type IComponent<T> = (_props: {
    schema: T;
}) => any;
export type IComponentGroup<T> = (_props: {
    schema: T;
    children: any;
}) => any;
export type IComponentArray<T> = (_props: {
    schema: T;
    children: (_propsChildren: {
        value: any[];
        container: IComponentContainer<T>;
    }) => any;
}) => any;
export type IComponentObject<T> = (_props: {
    schema: T;
    children: (_propsChildren: {
        value: Record<string, any>;
        container: IComponentContainer<T>;
    }) => any;
}) => any;
export type IComponents = {
    FIELD: Record<string, IComponent<any>>;
    VIEW: Record<string, IComponent<any>>;
    GROUP: Record<string, IComponentGroup<any>>;
    "FIELD-ARRAY": Record<string, IComponentArray<any>>;
    "FIELD-OBJECT": Record<string, IComponentObject<any>>;
};
export declare const ComponentContext: import("react").Context<{
    components: IComponents;
}>;
export default ComponentContext;
