import type { IState, ISubject } from "../logic/createForm";
type IUseSubscribeProps = {
    subject: keyof ISubject;
    callback: (state: IState) => any;
    form?: any;
    disabled?: boolean;
};
declare const useSubscribe: (props: IUseSubscribeProps) => void;
export default useSubscribe;
