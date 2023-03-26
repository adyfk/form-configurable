/// <reference types="react" />
import { IForm, IConfig, ICreateFormProps, IState } from "../logic/createForm";
export declare const useForm: <TSchema>(props: ICreateFormProps<TSchema>) => {
    config: IConfig<TSchema>;
    form: IForm<TSchema>;
    state: {
        isSubmitting: boolean;
        isSubmitted: boolean;
        isSubmitSuccessful: boolean;
        isValidating: boolean;
    };
    handleSubmit: (onValid: (values: Record<string, any>, state?: IState | undefined) => void | Promise<void>, onInvalid?: ((values: Record<string, any>, errors: Record<string, any>, type?: "ON-SCHEMA" | "ON-SUBMIT" | undefined, istate?: IState | undefined) => void) | undefined, options?: {
        forceSubmit: boolean;
    }) => (event: import("react").FormEvent<Element>) => Promise<void>;
};
export default useForm;
