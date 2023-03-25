import { IForm, IConfig, ICreateFormProps } from "../logic/createForm";
export declare const useForm: <TSchema>(props: ICreateFormProps<TSchema>) => {
    config: IConfig<TSchema>;
    form: IForm<TSchema>;
    state: {
        isSubmitting: boolean;
        isSubmitted: boolean;
        isSubmitSuccessful: boolean;
        isValidating: boolean;
    };
};
export default useForm;
