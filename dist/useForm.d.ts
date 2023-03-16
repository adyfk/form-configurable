import { FormEvent } from 'react';
import { CreateFormProps, RootFormState } from './logic/createForm';
import { Schema } from './types';
interface IUserFormProps extends CreateFormProps {
    forceSubmitOnError?: boolean;
    log?: (...arg: any) => void;
}
export declare const initializeRootFormState: ({ isDirty, isSubmitSuccessful, isSubmitted, isValid, isSubmitting, isValidating, }: RootFormState) => {
    isDirty: boolean;
    isSubmitSuccessful: boolean;
    isSubmitted: boolean;
    isValid: boolean;
    isSubmitting: boolean;
    isValidating: boolean;
};
export declare const useForm: (props: IUserFormProps) => {
    schema: Schema[];
    readonly form: {
        config: {
            schema: Schema[];
            extraData: import("./logic/createForm").FormValues;
            values: import("./logic/createForm").FormValues;
            initialValues: Record<string, any>;
        };
        props: import("./logic/createForm").Props;
        fields: import("./logic/createForm").Fields;
        refs: Record<string, any>;
        formState: RootFormState;
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
        setFormState: (formStateValue: Partial<RootFormState>) => void;
        executeConfig: (name?: string | undefined, options?: {
            skipValidate: boolean;
        }) => void;
        setFocus: (name: string, options?: {
            shouldSelect?: boolean | undefined;
        }) => void;
        reset: (arg?: CreateFormProps) => void;
    };
    readonly formState: RootFormState;
    handleSubmit: (onValid: (values: Record<string, any>) => Promise<void> | any, onInvalid?: ((errors: Record<string, any>, values: Record<string, any>, type: 'SCHEMA' | 'CUSTOM') => Promise<void> | any) | undefined) => (event: FormEvent) => Promise<void>;
};
export declare const FormContext: import("react").Context<{
    schema: Schema[];
    readonly form: {
        config: {
            schema: Schema[];
            extraData: import("./logic/createForm").FormValues;
            values: import("./logic/createForm").FormValues;
            initialValues: Record<string, any>;
        };
        props: import("./logic/createForm").Props;
        fields: import("./logic/createForm").Fields;
        refs: Record<string, any>;
        formState: RootFormState;
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
        setFormState: (formStateValue: Partial<RootFormState>) => void;
        executeConfig: (name?: string | undefined, options?: {
            skipValidate: boolean;
        }) => void;
        setFocus: (name: string, options?: {
            shouldSelect?: boolean | undefined;
        }) => void;
        reset: (arg?: CreateFormProps) => void;
    };
    readonly formState: RootFormState;
    handleSubmit: (onValid: (values: Record<string, any>) => Promise<void> | any, onInvalid?: ((errors: Record<string, any>, values: Record<string, any>, type: 'SCHEMA' | 'CUSTOM') => Promise<void> | any) | undefined) => (event: FormEvent) => Promise<void>;
}>;
export default useForm;
