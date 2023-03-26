import {
  useCallback, useContext, useEffect, useRef,
} from "react";
import useSubscribe from "./useSubscribe";
import useUpdate from "./useUpdate";
import { IForm, IState, initializeState } from "../logic/createForm";
import { ISchema } from "../types";
import { FormContext } from "../contexts/FormContext";
// import type { ISchema } from "../../types";

export const useSupport = (props: {
  form?: any;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { context } = useContext(FormContext);
  const { form: formContext } = useContext(context);
  const { form = formContext } = props as { form: IForm<ISchema> };
  const _state = useRef<IState["supportFormState"]>(initializeState.supportFormState);
  const update = useUpdate();

  const latestState = useCallback(
    (state: IState) => {
      const latestState = _state.current;

      if (JSON.stringify(state.supportFormState) !== JSON.stringify(latestState)) {
        _state.current = latestState;
        update();
      }
    },
    [],
  );

  useSubscribe({
    form,
    callback: latestState,
    subject: "supports",
  });

  useEffect(() => {
    latestState(form.state);
  }, []);

  return {
    form,
    state: _state.current,
  };
};

export default useSupport;
