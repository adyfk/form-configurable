import { FC } from "react";
import { IComponents } from "./ComponentContext";
export declare const FormContext: import("react").Context<{
    config: import("..").IConfig<any>;
    form: import("..").IForm<any>;
    state: {
        isSubmitting: boolean;
        isSubmitted: boolean;
        isSubmitSuccessful: boolean;
        isValidating: boolean;
    };
    handleSubmit: (onValid: (values: Record<string, any>, state?: import("..").IState | undefined) => void | Promise<void>, onInvalid?: ((values: Record<string, any>, errors: Record<string, any>, type?: "ON-SCHEMA" | "ON-SUBMIT" | undefined, istate?: import("..").IState | undefined) => void) | undefined, options?: {
        forceSubmit: boolean;
    }) => (event: import("react").FormEvent<Element>) => Promise<void>;
}>;
export declare const FormContextProvider: FC<{
    value: any;
    components: IComponents;
    children: any;
}>;
