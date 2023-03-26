import { IForm } from "../logic/createForm";
export declare const useWatchAll: (props: {
    form?: any;
    defaultValue: any;
    log?: (() => void) | undefined;
}) => {
    state: Record<string, any>;
    form: IForm<any>;
};
export default useWatchAll;
