import type { SchemaField } from 'gateway';
import { useEffect, useRef, useState } from 'react';
import { Control, Fields, FormValues } from './createFormControl';
import useSubscribe from './useSubscribe';

export type FieldProps = {
  name: string;
  control: Control;
  field: SchemaField;
};

export const initializeField = ({
  values,
  fields,
  name,
}: {
  values: FormValues;
  fields: Fields;
  name: string;
}) => {
  return {
    value: values[name],
    error: fields.error[name],
    touched: fields.touched[name],
    editable: fields.editable[name],
    show: fields.show[name],
  };
};

export const useField = ({
  control,
  name,
}: {
  control: Control;
  name: string;
}) => {
  const formState = control.formState;
  const _ref = useRef();
  const _state = useRef<any>({});
  const [state, updateState] = useState({ ..._state.current });

  const latestState = (values: FormValues, fields: Fields) => {
    const latestState = initializeField({ values, fields, name });
    if (JSON.stringify(_state.current) !== JSON.stringify(latestState)) {
      _state.current = latestState;
      updateState(latestState);
    }
  };
  useSubscribe({
    control,
    callback: latestState,
  });

  useEffect(() => {
    control.refs[name] = _ref;
    latestState(control.values, control.fields);
    return () => {
      delete control.refs[name];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control]);

  return {
    formState,
    ref: _ref,
    value: state.value,
    error: state.error,
    show: typeof state.show === 'undefined' ? true : state.show,
    editable: typeof state.editable === 'undefined' ? true : state.editable,
    touched: formState.isSubmitted || state.touched,
    onChange: (value: any) => control.onChange(name, value),
    onBlur: () => control.updateTouch(name),
  };
};

export default useField;
