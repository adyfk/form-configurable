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

export const useWatchAll = (props: {
  form?: any;
  defaultValue: any;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext } = props as { form: IForm<any> };
  const _state = useRef<IState["values"]>({} as any);
  const update = useUpdate();

  const latestState = useCallback(
    () => {
      const latestState = _state.current;
      const { values } = form.state;
      if (JSON.stringify(values) !== JSON.stringify(latestState)) {
        _state.current = values;
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
    state: _state.current,
    form,
  };
};

export default useWatchAll;
