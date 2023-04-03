import {
  useCallback, useEffect, useRef, useState,
} from "react";
import createForm, {
  IForm, IConfig, ICreateFormProps, IState, initializeState,
} from "../logic/createForm";
import useUpdate from "./useUpdate";
import useSubscribe from "./useSubscribe";

export const useForm = <TSchema>(props: ICreateFormProps<TSchema>) => {
  const [config, setConfig] = useState<IConfig<TSchema>>({
    schemas: props.schemas,
    extraData: props.extraData || {},
    initialValues: props.initialValues || {},
  });
  const update = useUpdate();
  const _form = useRef<IForm<TSchema>>(null as any);
  const _formState = useRef<IState["containerFormState"]>(initializeState.containerFormState);

  if (!_form.current) {
    _form.current = createForm<TSchema>(props);
  }

  const latestState = useCallback(
    (state: IState) => {
      const latestState = _formState.current;

      if (JSON.stringify(state.containerFormState) !== JSON.stringify(latestState)) {
        _formState.current = state.containerFormState;
        update();
      }
    },
    [],
  );

  useSubscribe({
    form: _form.current,
    callback: latestState,
    subject: "containers",
  });

  useEffect(() => {
    latestState(_form.current.state);
  }, []);

  useEffect(() => {
    _form.current.reset({
      schemas: props.schemas,
      extraData: props.extraData,
      initialValues: props.initialValues,
    });
    setConfig(_form.current.config);

    _form.current.notify("containers");
    _form.current.notify("fields");
  }, [props.schemas, props.extraData, props.initialValues]);

  return {
    config,
    form: _form.current,
    state: _formState.current,
    handleSubmit: _form.current.handleSubmit,
  };
};

export default useForm;
