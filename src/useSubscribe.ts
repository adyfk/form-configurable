import { useContext, useEffect } from 'react';
import { FormContext } from './useForm';
import {
  Form, Fields, Props, RootFormState,
} from './logic/createForm';

interface IUseSubscribePropsState {
  subject: 'state';
  // eslint-disable-next-line no-unused-vars
  callback: (values: Record<string, any>, fields: Fields, props: Props) => any;
}

interface IUseSubscribePropsContainer {
  subject: 'container';
  // eslint-disable-next-line no-unused-vars
  callback: (rootFormState: RootFormState) => any;
}

type IUseSubscribeProps = (IUseSubscribePropsState | IUseSubscribePropsContainer) & {

  form?: Form;
  disabled?: boolean;
}

const useSubscribe = (props: IUseSubscribeProps) => {
  const { form: formContext } = useContext(FormContext);
  const {
    form = formContext, callback, disabled, subject = 'state',
  } = props;

  useEffect(() => {
    if (disabled) return;

    const unsubscribe = form.subscribeWatch(callback, subject);
    // eslint-disable-next-line consistent-return
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
};

export default useSubscribe;
