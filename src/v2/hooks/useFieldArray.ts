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

// eslint-disable-next-line no-use-before-define
export const useFieldArray = <TSchema extends ISchemaFieldCore>(props: {
  form?: any;
  schema: TSchema;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, schema } = props as { form: IForm<TSchema>, schema: TSchema };
  const _ref = useRef<any>();

  useSubscribeAndCompare({
    form,
    getState() {
      const state = form.getSchemaFieldState(schema as any);
      const { attributeId } = props.schema.config;
      const value = state.value.map((item: any) => (attributeId ? item[attributeId] : item));
      return {
        ...state,
        value,
      };
    },
    subject: "fields",
  });

  useSubscribeAndCompare({
    form,
    subject: "containers",
  });

  useEffect(() => {
    form.fieldRef[schema.config.name] = _ref;
    return () => {
      delete form.fieldRef[schema.config.name];
    };
  }, [schema.config.name]);

  return {
    state: form.getSchemaFieldState<TSchema["initialValue"], TSchema["propStateType"] & IDefaultProp>(schema as any),
    formState: form.state.containerFormState,
    ref: _ref,
    form,
    data: schema.config.data || {},
    onChange: useCallback(
      (arg: any) => {
        if (typeof arg === "function") {
          form.setValue(schema.config.name, arg(form.state.values));
        } else {
          form.setValue(schema.config.name, arg);
        }
      },
      [schema.config.name, form],
    ),
    onBlur: useCallback(
      () => form.updateTouch(schema.config.name),
      [schema.config.name, form],
    ),
  };
};

export default useFieldArray;
