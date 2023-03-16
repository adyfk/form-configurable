import { Form, Fields, Props, RootFormState } from './logic/createForm';
interface IUseSubscribePropsState {
    subject: 'state';
    callback: (values: Record<string, any>, fields: Fields, props: Props) => any;
}
interface IUseSubscribePropsContainer {
    subject: 'container';
    callback: (rootFormState: RootFormState) => any;
}
type IUseSubscribeProps = (IUseSubscribePropsState | IUseSubscribePropsContainer) & {
    form?: Form;
    disabled?: boolean;
};
declare const useSubscribe: (props: IUseSubscribeProps) => void;
export default useSubscribe;
