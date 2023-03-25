import { useContext, useEffect } from "react";
import type { IState, ISubject } from "../logic/createForm";
import { FormContext } from "../contexts/FormContext";
// import type { ISchema } from "../../types";

type IUseSubscribeProps = {
  subject: keyof ISubject;
  // eslint-disable-next-line no-unused-vars
  callback: (state: IState) => any;
  form?: any;
  disabled?: boolean;
}

const useSubscribe = (props: IUseSubscribeProps) => {
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
