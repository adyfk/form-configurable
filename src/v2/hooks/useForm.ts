import {
  useEffect, useRef,
} from "react";
import createForm, {
  IForm, ICreateFormProps,
} from "../logic/createForm";
import useUpdate from "./useUpdate";
import useSubscribeAndCompare from "./useSubscribeAndCompare";

export const useForm = <TSchema>(props: ICreateFormProps<TSchema>) => {
  const update = useUpdate();
  const _form = useRef<IForm<TSchema>>(null as any);

  if (!_form.current) {
    _form.current = createForm<TSchema>(props);
  }

  useSubscribeAndCompare({
    form: _form.current,
    subject: "containers",
  });

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
    state: _form.current.state.containerFormState,
    handleSubmit: _form.current.handleSubmit,
  };
};

export default useForm;
