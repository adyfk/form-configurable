import { FormEvent } from "react";
import type { IObject, ISchema } from "../types";
export interface IState {
    containerFormState: {
        isSubmitting: boolean;
        isSubmitted: boolean;
        isSubmitSuccessful: boolean;
        isValidating: boolean;
    };
    supportFormState: {
        isValid: boolean;
        isDirty: boolean;
    };
    propsState: {
        disabled: Record<string, any>;
        hidden: Record<string, any>;
        [key: string]: Record<string, any>;
    };
    fieldsState: {
        touched: Record<string, boolean>;
        [key: string]: Record<string, any>;
    };
    fieldsRef: Record<string, any>;
    values: Record<string, any>;
    error: Record<string, any>;
}
export interface ISubject {
    fields: any[];
    containers: any[];
    supports: any[];
}
export interface ICreateFormProps<TSchema> {
    initialValues: IState["values"];
    schemas: TSchema[];
    formula?: any;
    extraData?: Record<string, any>;
    log?: (...args: any) => void;
    shouldFocusError?: boolean;
}
export interface IConfig<TSchema> {
    schemas: TSchema[];
    extraData: Record<string, any>;
    initialValues: Record<string, any>;
}
export declare const initializeState: {
    containerFormState: {
        isSubmitted: boolean;
        isSubmitSuccessful: boolean;
        isSubmitting: boolean;
        isValidating: boolean;
    };
    supportFormState: {
        isValid: boolean;
        isDirty: boolean;
    };
    propsState: {
        disabled: {};
        hidden: {};
    };
    fieldsState: {
        touched: {};
    };
    fieldsRef: {};
    error: {};
    values: {};
};
export declare function getSchemaKey(schema: ISchema, parent?: string): string;
export declare function getSchemaName(schema: ISchema, parent?: string): string;
declare const createForm: <TSchema>(props: ICreateFormProps<TSchema>) => {
    config: IConfig<TSchema>;
    state: IState;
    subject: ISubject;
    fieldRef: Record<string, any>;
    setContainerFormState: (formStateValue: Partial<IState["containerFormState"]>) => void;
    setSupportFormState: (formStateValue: Partial<IState["supportFormState"]>) => void;
    getValue: (key?: string) => any;
    setValue: (key: string, value: any, options?: {
        skipNotify: boolean;
    }) => void;
    getError: (key?: string) => any;
    getProp: (name: keyof IState["propsState"], key: string) => any;
    setValues: (values: IState["values"], options?: {
        skipNotify: boolean;
    }) => void;
    setFocus: (key: string) => void;
    handleSubmit: (onValid: (values: IState["values"], state?: IState) => Promise<void> | void, onInvalid?: ((values: IState["values"], errors: IState["error"], type?: "ON-SCHEMA" | "ON-SUBMIT", istate?: IState) => void) | undefined, options?: {
        forceSubmit: boolean;
    }) => (event: FormEvent) => Promise<void>;
    reset: ({ initialValues, schemas, extraData, }: Partial<Omit<ICreateFormProps<TSchema>, "formula">>) => void;
    getTouch: (key: string) => boolean;
    subscribe: (subject: keyof ISubject, callback: any) => () => void;
    notify: (subject: keyof ISubject) => void;
    getSchemaKey: typeof getSchemaKey;
    getSchemaFieldState: <TFieldProps = IObject, TFieldState = IObject>(schema: ISchema) => {
        value: any;
        error: any;
        propsState: TFieldProps;
        fieldState: TFieldState;
    };
    getSchemaViewState: <TFieldProps_1 = IObject>(schema: ISchema) => {
        value: any;
        propsState: TFieldProps_1;
    };
    updateTouch: (name: string, value?: boolean, shouldRender?: boolean) => void;
};
export type IForm<T> = ReturnType<typeof createForm<T>>;
export default createForm;
