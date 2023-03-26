import React from "react";
import { ISchema } from "../types";
import useForm from "../hooks/useForm";
import { Components } from "./ComponentContext";
export declare function createFormContext<T>(): React.Context<{
    config: import("..").IConfig<ISchema<T>>;
    form: import("..").IForm<ISchema<T>>;
    state: {
        isSubmitting: boolean;
        isSubmitted: boolean;
        isSubmitSuccessful: boolean;
        isValidating: boolean;
    };
}>;
export declare const FormContext: React.Context<{
    context: React.Context<ReturnType<(typeof useForm<ISchema<any>>)>>;
}>;
export declare function FormContextProvider({ context: Context, action, children, components }: {
    context: React.Context<ReturnType<(typeof useForm<ISchema<any>>)>>;
    action: ReturnType<(typeof useForm<ISchema<any>>)>;
    children: any;
    components: Components;
}): JSX.Element;
