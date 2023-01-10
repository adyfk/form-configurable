import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Schema } from './types/schema';
import { FormContext } from './useForm';
import { Fields, Form, FormValues, Props } from './logic/createForm';
import useSubscribe from './useSubscribe';

const initializeField = ({
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
    return {
      value: values[config.fieldName],
      error: fields.error[config.fieldName],
      touched: fields.touched[config.fieldName],
      editable: props.editable[config.key as string],
      show: props.show[config.key as string],
    };
  } else {
    return {
      editable: props.editable[config.key as string],
      show: props.show[config.key as string],
    };
  }
};

export const useConfig = (props: { form?: Form; config: Schema }) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, config } = props;
  const formState = form.formState;
  const _ref = useRef();
  const _state = useRef<any>({});
  const [state, updateState] = useState({ ..._state.current });

  const latestState = useCallback(
    (values: FormValues, fields: Fields, props: Props) => {
      const latestState = initializeField({ values, fields, props, config });
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
    disabled: config.variant !== 'FIELD' && !config.props?.length,
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
      value: state.value,
      error: state.error,
      show: typeof state.show === 'undefined' ? true : state.show,
      editable: typeof state.editable === 'undefined' ? true : state.editable,
      touched: formState.isSubmitted || state.touched,
      onChange: (value: any) => form.setValue(config.fieldName, value),
      onBlur: () => form.updateTouch(config.fieldName),
    };
  } else {
    return {
      show: typeof state.show === 'undefined' ? true : state.show,
      editable: typeof state.editable === 'undefined' ? true : state.editable,
    };
  }
};

export default useConfig;
