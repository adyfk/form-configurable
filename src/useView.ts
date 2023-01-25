/* eslint-disable no-underscore-dangle */
import {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { Schema } from './types';
import { FormContext } from './useForm';
import {
  Fields, Form, FormValues, Props,
} from './logic/createForm';
import useSubscribe from './useSubscribe';

export const initializeView = ({
  props,
  config,
}: {
  props: Props;
  config: Schema;
}) => {
  const field: {
    viewState: Record<string, any>;
  } = {
    viewState: {},
  };

  for (const key in props) {
    const value = props[key]?.[(config.name || config.key) as string];
    field.viewState[key] = typeof value === 'undefined' ? true : value;
  }

  return field;
};

type IStateInitializeView = ReturnType<typeof initializeView>;

export const useView = (props: { form?: Form; config: Schema }) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, config } = props;
  const _state = useRef<IStateInitializeView>(
    initializeView({ props: form.props, config }),
  );
  const [state, updateState] = useState<IStateInitializeView>({
    ..._state.current,
  });

  const latestState = useCallback(
    (values: FormValues, _: Fields, props: Props) => {
      const latestState = initializeView({ props, config });
      if (JSON.stringify(_state.current) !== JSON.stringify(latestState)) {
        _state.current = latestState;
        updateState(latestState);
      }
    },
    [config],
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
    viewState: state.viewState,
  };
};

export default useView;
