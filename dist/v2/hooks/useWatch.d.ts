import { IForm } from "../logic/createForm";
export declare const useWatch: <T>(props: {
    defaultValue?: any;
    form?: any;
    name: string;
    log?: (() => void) | undefined;
}) => {
    state: T;
    form: IForm<any>;
};
export default useWatch;
