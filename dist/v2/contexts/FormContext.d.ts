import { FC } from "react";
import { Components } from "./ComponentContext";
export declare const FormContext: import("react").Context<{
    config: import("..").IConfig<any>;
    form: import("..").IForm<any>;
    state: {
        isSubmitting: boolean;
        isSubmitted: boolean;
        isSubmitSuccessful: boolean;
        isValidating: boolean;
    };
}>;
export declare const FormContextProvider: FC<{
    value: any;
    components: Components;
    children: any;
}>;
