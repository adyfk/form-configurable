/// <reference types="react" />
import { SchemaField } from './types';
import { Fields, Form, FormValues, Props } from './logic/createForm';
export declare const initializeField: ({ values, fields, props, config, }: {
    values: FormValues;
    fields: Fields;
    props: Props;
    config: SchemaField;
}) => {
    value: any;
    error: any;
    touched: any;
    fieldState: Record<string, any>;
};
export type IStateInitializeField = ReturnType<typeof initializeField>;
export declare const useField: (props: {
    form?: {
        config: {
            schema: import("./types").Schema[];
            extraData: FormValues;
            values: FormValues;
            initialValues: Record<string, any>;
        };
        props: Props;
        fields: Fields;
        refs: Record<string, any>;
        formState: import("./logic/createForm").RootFormState;
        subjects: {
            watchs: any[];
            watchContainer: any[];
        };
        hasError: () => boolean;
        subscribeWatch: (callback: any, subject?: "container" | "state") => (() => void) | undefined;
        notifyWatch: (subject?: "container" | "state") => void;
        updateTouch: (name: string, value?: boolean, shouldRender?: boolean) => void;
        getValue: (name: string) => any;
        getError: (name: string) => string;
        getTouch: (name: string) => boolean;
        setValue: (name: string, value: any, options?: {
            freeze: boolean;
        } | undefined) => void;
        setValues: (values: Record<any, any>, options?: {
            freeze: boolean;
        } | undefined) => void;
        setError: (name: string, value?: any, options?: {
            freeze: boolean;
        } | undefined) => void;
        setErrors: (values: Record<any, any>, options?: {
            freeze: boolean;
        } | undefined) => void;
        setFormState: (formStateValue: Partial<import("./logic/createForm").RootFormState>) => void;
        executeConfig: (name?: string | undefined, options?: {
            skipValidate: boolean;
        }) => void;
        setFocus: (name: string, options?: {
            shouldSelect?: boolean | undefined;
        }) => void;
        reset: (arg?: import("./logic/createForm").CreateFormProps) => void;
    } | undefined;
    config: SchemaField;
    log?: ((config: SchemaField, field: IStateInitializeField) => void) | undefined;
}) => {
    form: {
        config: {
            schema: import("./types").Schema[];
            extraData: FormValues;
            values: FormValues;
            initialValues: Record<string, any>;
        };
        props: Props;
        fields: Fields;
        refs: Record<string, any>;
        formState: import("./logic/createForm").RootFormState;
        subjects: {
            watchs: any[];
            watchContainer: any[];
        };
        hasError: () => boolean;
        subscribeWatch: (callback: any, subject?: "container" | "state") => (() => void) | undefined;
        notifyWatch: (subject?: "container" | "state") => void;
        updateTouch: (name: string, value?: boolean, shouldRender?: boolean) => void;
        getValue: (name: string) => any;
        getError: (name: string) => string;
        getTouch: (name: string) => boolean;
        setValue: (name: string, value: any, options?: {
            freeze: boolean;
        } | undefined) => void;
        setValues: (values: Record<any, any>, options?: {
            freeze: boolean;
        } | undefined) => void;
        setError: (name: string, value?: any, options?: {
            freeze: boolean;
        } | undefined) => void;
        setErrors: (values: Record<any, any>, options?: {
            freeze: boolean;
        } | undefined) => void;
        setFormState: (formStateValue: Partial<import("./logic/createForm").RootFormState>) => void;
        executeConfig: (name?: string | undefined, options?: {
            skipValidate: boolean;
        }) => void;
        setFocus: (name: string, options?: {
            shouldSelect?: boolean | undefined;
        }) => void;
        reset: (arg?: import("./logic/createForm").CreateFormProps) => void;
    };
    formState: import("./logic/createForm").RootFormState;
    fieldState: Record<string, any>;
    ref: import("react").MutableRefObject<undefined>;
    value: any;
    error: any;
    touched: any;
    onChange: (arg: any) => void;
    onBlur: () => void;
};
export default useField;
