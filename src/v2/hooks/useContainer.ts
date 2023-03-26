import {
  useCallback, useContext, useEffect, useRef,
} from "react";
import useSubscribe from "./useSubscribe";
import useUpdate from "./useUpdate";
import { IForm, IState, initializeState } from "../logic/createForm";
import { FormContext } from "../contexts/FormContext";
import { ISchema } from "../types";
// import type { ISchema } from "../../types";

export const useContainer = (props: {
  form?: any;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { context } = useContext(FormContext);
  const { form: formContext } = useContext(context);
  const { form = formContext } = props as { form: IForm<ISchema> };
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
