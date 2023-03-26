import {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import useSubscribe from "./useSubscribe";
import useUpdate from "./useUpdate";
import { IState } from "../logic/createForm";
import { FormContext } from "../contexts/FormContext";

export const useWatchAll = (props: {
  form?: any;
  defaultValue: any;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { context } = useContext(FormContext);
  const { form: formContext } = useContext(context);
  const { form = formContext } = props;
  const _state = useRef<IState>({} as any);
  const update = useUpdate();

  const latestState = useCallback(
    (state: IState) => {
      const latestState = _state.current;

      if (JSON.stringify(state.values) !== JSON.stringify(latestState)) {
        _state.current = latestState;
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
    latestState(_state.current);
  }, []);

  return {
    state: _state.current,
    form,
  };
};

export default useWatchAll;
