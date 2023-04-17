import {
  useContext,
  useRef,
} from "react";
import { IForm, IState } from "../logic/createForm";
import { FormContext } from "../contexts/FormContext";
import useSubscribeAndCompare from "./useSubscribeAndCompare";

export const useWatch = <T>(props: {
  defaultValue?: any;
  form?: any;
  name: string;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, name } = props as { form: IForm<any>, name: string };
  const _state = useRef<IState>(form.getValue(name) || props.defaultValue);

  useSubscribeAndCompare({
    form,
    subject: "fields",
    getState() {
      return form.getValue(name);
    },
  });

  return {
    state: _state.current as T,
    form,
  };
};

export default useWatch;
