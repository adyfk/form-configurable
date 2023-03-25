import {
  useCallback, useContext, useEffect, useRef,
} from "react";
import { SchemaField } from "./types";
import {
  Fields, Form, FormValues, Props,
} from "./logic/createForm";
import useSubscribe from "./useSubscribe";
import { FormContext } from "./useForm";
import get from "./utils/get";
import useUpdate from "./hooks/useUpdate";

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
    field.fieldState[key] = typeof value === "undefined" ? true : value;
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
      values: form.config.values,
      fields: form.fields,
      props: form.props,
      config,
    }),
  );
  const update = useUpdate();

  const latestState = useCallback(
    (values: FormValues, fields: Fields, props: Props) => {
      const latestState = initializeField({
        values, fields, props, config,
      });

      if (JSON.stringify(_state.current) !== JSON.stringify(latestState)) {
        _state.current = latestState;
        update();
      }
    },
    [config],
  );

  useSubscribe({
    form,
    callback: latestState,
    subject: "state",
  });

  useEffect(() => {
    latestState(form.config.values, form.fields, form.props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  useEffect(() => {
    form.refs[config.name] = _ref;
    return () => {
      delete form.refs[config.name];
    };
  }, [config.name, form.refs]);

  log?.(config, _state.current);

  return {
    form,
    formState,
    fieldState: _state.current.fieldState,
    ref: _ref,
    value: _state.current.value,
    error: _state.current.error,
    touched: formState.isSubmitted || _state.current.touched,
    onChange: useCallback(
      (arg: any) => {
        if (typeof arg === "function") {
          form.setValue(config.name, arg(form.config.values));
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
