import {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import useSubscribe from "./useSubscribe";
import useUpdate from "./useUpdate";
import { IDefaultProp, ISchemaViewCore } from "../types";
import { IForm } from "../logic/createForm";
import { FormContext } from "../contexts/FormContext";

export const useView = <TSchema extends ISchemaViewCore>(props: {
  form?: any;
  schema: TSchema;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, schema } = props as { form: IForm<TSchema>, schema: TSchema };
  const _state = useRef(form.getSchemaViewState<TSchema["propStateType"] & IDefaultProp>(schema as any));
  const update = useUpdate();

  const latestState = useCallback(
    () => {
      const latestState = _state.current;

      if (JSON.stringify(form.getSchemaViewState<TSchema["propStateType"] & IDefaultProp>(schema as any)) !== JSON.stringify(latestState)) {
        _state.current = latestState;
        update();
      }
    },
    [schema],
  );

  useSubscribe({
    form,
    callback: latestState,
    subject: "fields",
  });

  useEffect(() => {
    latestState();
  }, [schema]);

  return {
    state: _state.current,
    data: schema.config.data || {},
    form,
  };
};

export default useView;
