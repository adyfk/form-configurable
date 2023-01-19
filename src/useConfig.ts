import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Schema } from './types/schema';
import { FormContext } from './useForm';
import { Fields, Form, FormValues, Props } from './logic/createForm';
import useSubscribe from './useSubscribe';
import { initializeField } from './useField';
import { initializeView } from './useView';

const initializeConfig = ({
  values,
  fields,
  props,
  config,
}: {
  values: FormValues;
  fields: Fields;
  props: Props;
  config: Schema;
}) => {
  if (config.variant === 'FIELD') {
    return initializeField({ values, fields, props, config });
  } else {
    return initializeView({ props, config });
  }
};

type IStateInitializeConfig = ReturnType<typeof initializeConfig>;

export const useConfig = (props: { form?: Form; config: Schema }) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, config } = props;
  const formState = form.formState;
  const _ref = useRef();
  const _state = useRef<IStateInitializeConfig>(
    initializeConfig({
      values: form.values,
      fields: form.fields,
      props: form.props,
      config,
    })
  );
  const [state, updateState] = useState<IStateInitializeConfig>({
    ..._state.current,
  });

  const latestState = useCallback(
    (values: FormValues, fields: Fields, props: Props) => {
      const latestState = initializeConfig({ values, fields, props, config });
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

  useEffect(() => {
    if (config.variant !== 'FIELD') return;

    form.refs[config.fieldName] = _ref;
    return () => {
      delete form.refs[config.fieldName];
    };
  });

  if (config.variant === 'FIELD') {
    return {
      formState,
      ref: _ref,
      state,
      onChange: (value: any) => form.setValue(config.fieldName, value),
      onBlur: () => form.updateTouch(config.fieldName),
    };
  } else {
    return {
      state,
    };
  }
};

export default useConfig;
