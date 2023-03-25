import {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import useSubscribe from "./useSubscribe";
import useUpdate from "./useUpdate";
import type { IForm } from "../logic/createForm";
import { IDefaultProp, ISchemaFieldCore } from "../types";
import { FormContext } from "../contexts/FormContext";

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
  const _state = useRef(form.getSchemaFieldState<TSchema["propStateType"] & IDefaultProp>(schema as any));
  const update = useUpdate();

  const latestState = useCallback(
    () => {
      const latestState = _state.current;

      if (JSON.stringify(form.getSchemaFieldState<TSchema["propStateType"] & IDefaultProp>(schema as any)) !== JSON.stringify(latestState)) {
        _state.current = latestState;
        update();
      }
    },
    [schema],
  );

  useSubscribe({
    form,
    callback: latestState,
    subject: "fields",
  });

  useEffect(() => {
    latestState();
  }, [schema]);

  useEffect(() => {
    form.fieldRef[schema.config.name] = _ref;
    return () => {
      delete form.fieldRef[schema.config.name];
    };
  }, [schema.config.name]);

  return {
    state: _state.current,
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

export default useField;
