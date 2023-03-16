import type { Schema } from '../types';
export type Props = {
    show: Record<string, boolean>;
    editable: Record<string, boolean>;
    [key: string]: Record<string, boolean>;
};
export interface Fields {
    error: Record<string, string>;
    touched: Record<string, boolean>;
}
export interface FormState {
    error: boolean;
    touched: boolean;
}
export interface RootFormState {
    isSubmitting: boolean;
    isSubmitted: boolean;
    isSubmitSuccessful: boolean;
    isValidating: boolean;
    isValid: boolean;
    isDirty: boolean;
}
export type FormValues = Record<string, any>;
export interface CreateFormProps {
    schema?: Schema[];
    extraData?: FormValues;
    log?: (...arg: any) => void;
    initialValues?: Record<string, any>;
    shouldFocusError?: boolean;
}
export declare const createForm: (props: CreateFormProps) => {
    config: {
        schema: Schema[];
        extraData: FormValues;
        values: FormValues;
        initialValues: Record<string, any>;
    };
    props: Props;
    fields: Fields;
    refs: Record<string, any>;
    formState: RootFormState;
    subjects: {
        watchs: any[];
        watchContainer: any[];
    };
    hasError: () => boolean;
    subscribeWatch: (callback: any, subject?: 'state' | 'container') => (() => void) | undefined;
    notifyWatch: (subject?: 'state' | 'container') => void;
    updateTouch: (name: string, value?: boolean, shouldRender?: boolean) => void;
    getValue: (name: string) => any;
    getError: (name: string) => string;
    getTouch: (name: string) => boolean;
    setValue: (name: string, value: any, options?: {
        freeze: boolean;
    }) => void;
    setValues: (values: Record<any, any>, options?: {
        freeze: boolean;
    }) => void;
    setError: (name: string, value?: any, options?: {
        freeze: boolean;
    }) => void;
    setErrors: (values: Record<any, any>, options?: {
        freeze: boolean;
    }) => void;
    setFormState: (formStateValue: Partial<RootFormState>) => void;
    executeConfig: (name?: string, options?: {
        skipValidate: boolean;
    }) => void;
    setFocus: (name: string, options?: {
        shouldSelect?: boolean;
    }) => void;
    reset: (arg?: CreateFormProps) => void;
};
export type Form = ReturnType<typeof createForm>;
export default createForm;
