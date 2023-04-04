import {
  useCallback, useEffect, useRef,
} from "react";
import createForm, {
  IForm, ICreateFormProps, IState, initializeState,
} from "../logic/createForm";
import useUpdate from "./useUpdate";
import useSubscribe from "./useSubscribe";

export const useForm = <TSchema>(props: ICreateFormProps<TSchema>) => {
  const update = useUpdate();
  const _form = useRef<IForm<TSchema>>(null as any);
  const _formState = useRef<IState["containerFormState"]>(initializeState.containerFormState);

  if (!_form.current) {
    _form.current = createForm<TSchema>(props);
    _form.current.reset({});
  }

  const latestState = useCallback(
    () => {
      update();
    },
    [],
  );

  useSubscribe({
    form: _form.current,
    callback: latestState,
    subject: "containers",
  });

  useEffect(() => {
    latestState();
  }, []);

  useEffect(() => {
    _form.current.reset({
      schemas: props.schemas,
      extraData: props.extraData,
      initialValues: props.initialValues,
    });
    update();
  }, [props.schemas, props.extraData, props.initialValues]);

  return {
    form: _form.current,
    state: _formState.current,
    handleSubmit: _form.current.handleSubmit,
  };
};

export default useForm;
