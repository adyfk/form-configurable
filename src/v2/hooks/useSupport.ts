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
  const { form: formContext } = useContext(FormContext);
  const { form = formContext } = props as { form: IForm<ISchema> };
  const _state = useRef<IState["supportFormState"]>(structuredClone(initializeState.supportFormState));
  const update = useUpdate();

  const latestState = useCallback(
    () => {
      const latestState = _state.current;

      if (JSON.stringify(form.state.supportFormState) !== JSON.stringify(latestState)) {
        _state.current = form.state.supportFormState;
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
    latestState();
  }, []);

  return {
    form,
    state: _state.current,
  };
};

export default useSupport;
