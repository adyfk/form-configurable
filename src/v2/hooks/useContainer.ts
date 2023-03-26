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
  const { form: formContext } = useContext(FormContext);
  const { form = formContext } = props as { form: IForm<ISchema> };
  const _state = useRef<IState["containerFormState"]>(initializeState.containerFormState);
  const update = useUpdate();

  const latestState = useCallback(
    () => {
      const latestState = _state.current;
      const { containerFormState } = form.state;
      if (JSON.stringify(containerFormState) !== JSON.stringify(latestState)) {
        _state.current = containerFormState;
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
    latestState();
  }, []);

  return {
    form,
    state: _state.current,
  };
};

export default useContainer;
