import { IForm } from "../logic/createForm";
export declare const useContainer: (props: {
    form?: any;
    log?: (() => void) | undefined;
}) => {
    form: IForm<any> | IForm<import("../types").INativeSchema<null>>;
    state: {
        isSubmitting: boolean;
        isSubmitted: boolean;
        isSubmitSuccessful: boolean;
        isValidating: boolean;
    };
};
export default useContainer;
