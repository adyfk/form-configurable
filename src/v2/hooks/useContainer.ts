import {
  useCallback, useContext, useEffect, useRef,
} from "react";
import useSubscribe from "./useSubscribe";
import { FormContext } from "./useForm";
import useUpdate from "./useUpdate";
import { IForm, IState, initializeState } from "../logic/createForm";
// import type { ISchema } from "../../types";

export const useContainer = (props: {
  form?: IForm<any>;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext } = props;
  const _state = useRef<IState["containerFormState"]>(initializeState.containerFormState);
  const update = useUpdate();

  const latestState = useCallback(
    (state: IState) => {
      const latestState = _state.current;

      if (JSON.stringify(state.containerFormState) !== JSON.stringify(latestState)) {
        _state.current = latestState;
        update();
      }
    },
    [],
  );

  useSubscribe({
    form,
    callback: latestState,
    subject: "containers",
  });

  useEffect(() => {
    latestState(form.state);
  }, []);

  return {
    form,
    state: _state.current,
  };
};

export default useContainer;
