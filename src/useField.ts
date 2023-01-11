import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SchemaFieldType } from './types/schema';
import { Fields, Form, FormValues, Props } from './logic/createForm';
import useSubscribe from './useSubscribe';
import { FormContext } from './useForm';

const initializeField = ({
  values,
  fields,
  props,
  config,
}: {
  values: FormValues;
  fields: Fields;
  props: Props;
  config: SchemaFieldType;
}) => ({
  value: values[config.fieldName],
  error: fields.error[config.fieldName],
  touched: fields.touched[config.fieldName],
  editable: props.editable[config.key as string],
  show: props.show[config.key as string],
});

export const useField = (props: {
  form?: Form;
  config: SchemaFieldType;
  debug?: boolean;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, config, debug } = props;
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
  });

  useEffect(() => {
    latestState(form.values, form.fields, form.props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  useEffect(() => {
    form.refs[config.fieldName] = _ref;
    return () => {
      delete form.refs[config.fieldName];
    };
  });

  debug && console.log(`field - ${config.fieldName} =`, { state, formState });

  return {
    form,
    formState,
    ref: _ref,
    value: state.value,
    error: state.error,
    show: typeof state.show === 'undefined' ? true : state.show,
    editable: typeof state.editable === 'undefined' ? true : state.editable,
    touched: formState.isSubmitted || state.touched,
    onChange: useCallback(
      (arg: any) => {
        if (typeof arg === 'function') {
          form.setValue(config.fieldName, arg(form.values));
        } else {
          form.setValue(config.fieldName, arg);
        }
      },
      [config.fieldName, form]
    ),
    onBlur: useCallback(
      () => form.updateTouch(config.fieldName),
      [config.fieldName, form]
    ),
  };
};

export default useField;
