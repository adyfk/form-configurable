import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Schema } from './types/schema';
import { FormContext } from './useForm';
import { Fields, Form, FormValues, Props } from './logic/createForm';
import useSubscribe from './useSubscribe';

const initializeView = ({
  props,
  config,
}: {
  props: Props;
  config: Schema;
}) => {
  return {
    editable: props.editable[config.key as string],
    show: props.show[config.key as string],
  };
};

export const useView = (props: { form?: Form; config: Schema }) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, config } = props;
  const _state = useRef<any>({});
  const [state, updateState] = useState({ ..._state.current });

  const latestState = useCallback(
    (values: FormValues, _: Fields, props: Props) => {
      const latestState = initializeView({ props, config });
      if (JSON.stringify(_state.current) !== JSON.stringify(latestState)) {
        _state.current = latestState;
        updateState(latestState);
      }
    },
    [config]
  );

  useSubscribe({
    form,
    callback: latestState,
    disabled: !config.props?.length,
  });

  useEffect(() => {
    latestState(form.values, form.fields, form.props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return {
    show: typeof state.show === 'undefined' ? true : state.show,
    editable: typeof state.editable === 'undefined' ? true : state.editable,
  };
};

export default useView;
