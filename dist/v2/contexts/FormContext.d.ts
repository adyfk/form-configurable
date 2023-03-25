/// <reference types="react" />
export declare const FormContext: import("react").Context<{
    config: import("..").IConfig<import("../types").INativeSchema>;
    form: import("..").IForm<import("../types").INativeSchema>;
    state: {
        isSubmitting: boolean;
        isSubmitted: boolean;
        isSubmitSuccessful: boolean;
        isValidating: boolean;
    };
}>;
