import {
  useContext,
  useRef,
} from "react";
import { IForm, IState } from "../logic/createForm";
import { FormContext } from "../contexts/FormContext";
import useSubscribeAndCompare from "./useSubscribeAndCompare";

export const useWatchAll = (props: {
  form?: any;
  defaultValue: any;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext } = props as { form: IForm<any> };
  const _state = useRef<IState["values"]>({} as any);

  useSubscribeAndCompare({
    form,
    subject: "fields",
  });

  return {
    state: _state.current,
    form,
  };
};

export default useWatchAll;
