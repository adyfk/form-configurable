import { IForm } from "../logic/createForm";
export declare const useSupport: (props: {
    form?: any;
    log?: (() => void) | undefined;
}) => {
    form: IForm<any> | IForm<import("../types").INativeSchema<null>>;
    state: {
        isValid: boolean;
        isDirty: boolean;
    };
};
export default useSupport;
