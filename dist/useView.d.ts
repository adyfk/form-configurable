import { Schema } from './types';
import { Fields, Form, FormValues, Props } from './logic/createForm';
export declare const initializeView: ({ values, props, config, }: {
    values: FormValues;
    props: Props;
    config: Schema;
}) => {
    data: any;
    viewState: Record<string, any>;
};
export declare const useView: (props: {
    form?: {
        config: {
            schema: Schema[];
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
    config: Schema;
}) => {
    form: {
        config: {
            schema: Schema[];
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
    data: any;
    viewState: Record<string, any>;
};
export default useView;
