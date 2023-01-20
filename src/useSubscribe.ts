import { useContext, useEffect } from 'react';
import { FormContext } from './useForm';
import { Form, Fields, Props } from './logic/createForm';

const useSubscribe = (props: {
  form?: Form;
  // eslint-disable-next-line no-unused-vars
  callback: (values: Record<string, any>, fields: Fields, props: Props) => any;
  disabled?: boolean;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, callback, disabled } = props;

  useEffect(() => {
    if (disabled) return;

    const unsubscribe = form.subscribeWatch(callback);
    // eslint-disable-next-line consistent-return
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
};

export default useSubscribe;
