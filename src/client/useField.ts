import type { SchemaField } from 'gateway';
import { useEffect, useRef, useState } from 'react';
import { Control } from './createFormControl';
import { useSubscribe } from './useSubscribe';

export type FieldProps = {
  name: string;
  control: Control;
  field: SchemaField;
};

export const initializeField = ({
  control,
  name,
}: {
  control: Control;
  name: string;
}) => {
  return {
    value: control.values[name],
    error: control.fields.errors[name],
    touched: control.fields.touchedFields[name],
    hidden: control.fields.hiddenFields[name],
    disabled: control.fields.disabledFields[name],
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
  const _state = useRef(initializeField({ control, name }));
  const [state, updateState] = useState({ ..._state.current });

  useSubscribe({
    subject: control.subjects.all,
    callback: () => {
      const latestState = initializeField({ control, name });
      if (JSON.stringify(_state.current) !== JSON.stringify(latestState)) {
        _state.current = latestState;
        updateState(latestState);
      }
    },
  });

  useEffect(() => {
    control.refs[name] = _ref;
    return () => {
      delete control.refs[name];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    formState,
    ref: _ref,
    value: state.value,
    error: state.error,
    hidden: state.hidden,
    disabled: state.disabled,
    touched: formState.isSubmitted || state.touched,
    onChange: (value: any) => control.onChange(name, value),
    onBlur: () => control.updateTouch(name),
  };
};

export default useField;
