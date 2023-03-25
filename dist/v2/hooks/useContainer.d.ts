import { IForm } from "../logic/createForm";
export declare const useContainer: (props: {
    form?: any;
    log?: (() => void) | undefined;
}) => {
    form: IForm<import("../types").INativeSchema>;
    state: {
        isSubmitting: boolean;
        isSubmitted: boolean;
        isSubmitSuccessful: boolean;
        isValidating: boolean;
    };
};
export default useContainer;
