import { useContext, useEffect } from "react";
import { FormContext } from "./useForm";
import type { IForm, IState, ISubject } from "../logic/createForm";
// import type { ISchema } from "../../types";

type IUseSubscribeProps<TSchema> = {
  subject: keyof ISubject;
  // eslint-disable-next-line no-unused-vars
  callback: (state: IState) => any;
  form?: IForm<TSchema>;
  disabled?: boolean;
}

const useSubscribe = (props: IUseSubscribeProps<any>) => {
  const { form: formContext } = useContext(FormContext);
  const {
    form = formContext,
    callback,
    disabled,
    subject = "fields",
  } = props;

  useEffect(() => {
    if (disabled) return;

    const unsubscribe = form.subscribe(subject, callback);
    // eslint-disable-next-line consistent-return
    return unsubscribe;
  }, [disabled, form]);
};

export default useSubscribe;
