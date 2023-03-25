import { IState } from "../logic/createForm";
export declare const useWatchAll: (props: {
    form?: any;
    defaultValue: any;
    log?: (() => void) | undefined;
}) => {
    state: IState;
    form: any;
};
export default useWatchAll;
