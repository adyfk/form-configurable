import { useContext, useEffect } from 'react';
import { FormContext } from './useForm';
import { Form, Fields, Props } from './logic/createForm';

const useSubscribe = (props: {
  form?: Form;
  callback: (values: Record<string, any>, fields: Fields, props: Props) => any;
  disabled?: boolean;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, callback, disabled } = props;

  useEffect(() => {
    if (disabled) return;

    const unsubscribe = form.subscribeWatch(callback);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
};

export default useSubscribe;
