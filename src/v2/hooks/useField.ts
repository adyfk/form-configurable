import {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import type { IForm } from "../logic/createForm";
import { IDefaultProp, ISchemaFieldCore } from "../types";
import { FormContext } from "../contexts/FormContext";
import useSubscribeAndCompare from "./useSubscribeAndCompare";
import generateId from "../utils/generateId";

// eslint-disable-next-line no-use-before-define
export const useField = <TSchema extends ISchemaFieldCore>(props: {
  form?: any;
  schema: TSchema;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, schema } = props as { form: IForm<TSchema>, schema: TSchema };
  const _ref = useRef<any>();

  const identity = schema.config?.name || schema.key || generateId();

  useSubscribeAndCompare({
    form,
    getState() {
      return form.getSchemaFieldState(schema as any);
    },
    subject: "fields",
  });

  useSubscribeAndCompare({
    form,
    subject: "containers",
  });

  useEffect(() => {
    form.state.fieldsRef[identity] = _ref;
    return () => {
      delete form.state.fieldsRef[identity];
    };
  }, [identity]);

  return {
    state: form.getSchemaFieldState<TSchema["initialValue"], TSchema["propStateType"] & IDefaultProp>(schema as any),
    formState: form.state.containerFormState,
    ref: _ref,
    form,
    data: schema.config?.data || {},
    onChange: useCallback(
      (arg: any) => {
        if (typeof arg === "function") {
          form.setValue(identity, arg(form.state.values));
        } else {
          form.setValue(identity, arg);
        }
      },
      [identity, form],
    ),
    onBlur: useCallback(
      () => form.updateTouch(identity),
      [identity, form],
    ),
  };
};

export default useField;
