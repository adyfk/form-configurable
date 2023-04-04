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
export const useFieldArray = <TSchema extends ISchemaFieldCore>(props: {
  form?: any;
  schema: TSchema;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const {
    form = formContext,
    schema,
  } = props as { form: IForm<TSchema>, schema: TSchema };
  const _ref = useRef<any>();
  const _state = useRef(form.getSchemaFieldState<TSchema["initialValue"], TSchema["propStateType"] & IDefaultProp>(schema as any));
  const update = useUpdate();

  const latestState = useCallback(
    () => {
      const latestState = _state.current;
      const state = form.getSchemaFieldState<TSchema["initialValue"], TSchema["propStateType"] & IDefaultProp>(schema as any);

      if (
        JSON.stringify({
          length: state.value?.length,
          fieldState: state.fieldState,
          propsState: state.propsState,
          error: state.error,
        })
        !== JSON.stringify({
          length: latestState.value?.length,
          fieldState: latestState.fieldState,
          propsState: latestState.propsState,
          error: latestState.error,
        })) {
        _state.current = state;
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
    state: form.getSchemaFieldState<TSchema["initialValue"], TSchema["propStateType"] & IDefaultProp>(schema as any),
    formState: form.state.containerFormState,
    ref: _ref,
    form,
    data: schema.config.data || {},
    onPush: useCallback(
      (arg: any) => {
        form.setValue(
          schema.config.name,
          [
            ...form.getValue(schema.config.name),
            arg,
          ],
        );
      },
      [schema.config.name, form],
    ),
    onUnshift: useCallback(
      (arg: any) => {
        form.setValue(
          schema.config.name,
          [
            arg,
            ...form.getValue(schema.config.name),
          ],
        );
      },
      [schema.config.name, form],
    ),
    onReplace: useCallback(
      (id: any, arg: any, callbackId: (_item: string) => any) => {
        const values = [...form.getValue(schema.config.name)];
        const index = values.findIndex((item: any) => callbackId(item) === id);
        if (index === -1) {
          return;
        }
        values.splice(index, 1, arg);

        form.setValue(schema.config.name, values);
      },
      [schema.config.name, form],
    ),
    onDelete: useCallback(
      (id: any, callbackId: (_item: string) => any) => {
        const values = [...form.getValue(schema.config.name)];
        const index = values.findIndex((item: any) => callbackId(item) === id);
        if (index === -1) {
          return;
        }
        values.splice(index, 1);

        form.setValue(schema.config.name, values);
      },
      [schema.config.name, form],
    ),
    onClear: useCallback(
      () => {
        form.setValue(schema.config.name, []);
      },
      [schema.config.name, form],
    ),
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
