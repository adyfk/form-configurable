import { IForm } from "../logic/createForm";
export declare const useSupport: (props: {
    form?: any;
    log?: (() => void) | undefined;
}) => {
    form: IForm<import("../types").INativeSchema>;
    state: {
        isValid: boolean;
        isDirty: boolean;
    };
};
export default useSupport;
