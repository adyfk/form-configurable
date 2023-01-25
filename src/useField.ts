import {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { SchemaField } from './types';
import {
  Fields, Form, FormValues, Props,
} from './logic/createForm';
import useSubscribe from './useSubscribe';
import { FormContext } from './useForm';
import get from './utils/get';

export const initializeField = ({
  values,
  fields,
  props,
  config,
}: {
  values: FormValues;
  fields: Fields;
  props: Props;
  config: SchemaField;
}) => {
  const field: {
    value: any;
    error: any;
    touched: any;
    fieldState: Record<string, any>;
  } = {
    value: get(values, config.name),
    error: fields.error[config.name],
    touched: fields.touched[config.name],
    fieldState: {},
  };

  for (const key in props) {
    const value = props[key]?.[config.name as string];
    field.fieldState[key] = typeof value === 'undefined' ? true : value;
  }

  return field;
};

export type IStateInitializeField = ReturnType<typeof initializeField>;

export const useField = (props: {
  form?: Form;
  config: SchemaField;
  // eslint-disable-next-line no-unused-vars
  log?: (config: SchemaField, field: IStateInitializeField) => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, config, log } = props;
  const { formState } = form;
  const _ref = useRef();
  const _state = useRef<IStateInitializeField>(
    initializeField({
      values: form.values,
      fields: form.fields,
      props: form.props,
      config,
    }),
  );

  const [state, updateState] = useState<IStateInitializeField>({
    ..._state.current,
  });

  const latestState = useCallback(
    (values: FormValues, fields: Fields, props: Props) => {
      const latestState = initializeField({
        values, fields, props, config,
      });

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
  });

  useEffect(() => {
    latestState(form.values, form.fields, form.props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  useEffect(() => {
    form.refs[config.name] = _ref;
    return () => {
      delete form.refs[config.name];
    };
  }, [config.name, form.refs]);

  log?.(config, state);

  return {
    form,
    formState,
    fieldState: state.fieldState,
    ref: _ref,
    value: state.value,
    error: state.error,
    touched: formState.isSubmitted || state.touched,
    onChange: useCallback(
      (arg: any) => {
        if (typeof arg === 'function') {
          form.setValue(config.name, arg(form.values));
        } else {
          form.setValue(config.name, arg);
        }
      },
      [config.name, form],
    ),
    onBlur: useCallback(
      () => form.updateTouch(config.name),
      [config.name, form],
    ),
  };
};

export default useField;
