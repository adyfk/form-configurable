import { useCallback, useContext } from 'react';
import { FormContext } from './useForm';
import { Form } from './logic/createForm';
import useSubscribe from './useSubscribe';
import useUpdate from './hooks/useUpdate';

export const useWatch = (props: { form?: Form; disabled?: boolean }) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, disabled } = props;
  const update = useUpdate();

  const latestState = useCallback(
    () => {
      update();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useSubscribe({
    form,
    callback: latestState,
    disabled,
  });

  return {
    values: form.values,
    formState: form.formState,
    fields: form.fields,
  };
};

export default useWatch;
