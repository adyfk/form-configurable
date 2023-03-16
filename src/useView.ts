/* eslint-disable no-underscore-dangle */
import {
  useCallback, useContext, useEffect, useRef,
} from 'react';
import { Schema } from './types';
import { FormContext } from './useForm';
import {
  Fields, Form, FormValues, Props,
} from './logic/createForm';
import useSubscribe from './useSubscribe';
import get from './utils/get';
import useUpdate from './hooks/useUpdate';

export const initializeView = ({
  values,
  props,
  config,
}: {
  values: FormValues;
  props: Props;
  config: Schema;
}) => {
  const field: {
    data: any,
    viewState: Record<string, any>;
  } = {
    data: undefined,
    viewState: {},
  };

  for (const key in props) {
    const value = props[key]?.[(config.name || config.key) as string];
    field.viewState[key] = typeof value === 'undefined' ? true : value;
  }

  if (config.name) {
    field.data = get(values, config.name);
  }

  return field;
};

type IStateInitializeView = ReturnType<typeof initializeView>;

export const useView = (props: { form?: Form; config: Schema }) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, config } = props;

  const _state = useRef<IStateInitializeView>(
    initializeView({ values: form.config.values, props: form.props, config }),
  );
  const update = useUpdate();

  const latestState = useCallback(
    (values: FormValues, _: Fields, props: Props) => {
      const latestState = initializeView({ values, props, config });
      if (JSON.stringify(_state.current) !== JSON.stringify(latestState)) {
        _state.current = latestState;
        update();
      }
    },
    [config],
  );

  useSubscribe({
    subject: 'state',
    form,
    callback: latestState,
    disabled: !config.props?.length && !config.name,
  });

  useEffect(() => {
    latestState(form.config.values, form.fields, form.props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return {
    form,
    data: _state.current.data,
    viewState: _state.current.viewState,
  };
};

export default useView;
