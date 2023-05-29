import { useContext, useEffect } from "react";
import cloneDeep from "lodash.clonedeep";
import type { ISubject } from "../logic/createForm";
import { FormContext } from "../contexts/FormContext";
import useUpdate from "./useUpdate";
// import type { ISchema } from "../../types";

type IUseSubscribeAndCompareProps = {
  subject: keyof ISubject;
  // eslint-disable-next-line no-unused-vars
  form?: any;
  disabled?: boolean;
  getState?: () => any;
}

const useSubscribeAndCompare = (props: IUseSubscribeAndCompareProps) => {
  const update = useUpdate();
  const { form: formContext } = useContext(FormContext);
  const {
    form = formContext,
    disabled,
    subject = "fields",
    getState,
  } = props;

  useEffect(() => {
    if (disabled) return;

    let prevState = cloneDeep(getState?.());
    const unsubscribe = form.subscribe(subject, () => {
      if (!getState?.()) {
        update();
      } else if (JSON.stringify(prevState) !== JSON.stringify(getState())) {
        prevState = cloneDeep(getState());
        update();
      }
    });
    // eslint-disable-next-line consistent-return
    return unsubscribe;
  }, [disabled, form]);
};

export default useSubscribeAndCompare;
