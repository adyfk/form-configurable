import {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import useSubscribe from "./useSubscribe";
import useUpdate from "./useUpdate";
import { IForm, IState } from "../logic/createForm";
import { FormContext } from "../contexts/FormContext";

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
  const update = useUpdate();

  const latestState = useCallback(
    () => {
      const latestState = _state.current;
      const state = form.getValue(name);
      if (JSON.stringify(state) !== JSON.stringify(latestState)) {
        _state.current = state;
        update();
      }
    },
    [],
  );

  useSubscribe({
    form,
    callback: latestState,
    subject: "fields",
  });

  useEffect(() => {
    latestState();
  }, []);

  return {
    state: _state.current as T,
    form,
  };
};

export default useWatch;
