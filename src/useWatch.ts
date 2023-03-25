/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useRef } from "react";
import { FormContext } from "./useForm";
import { Form, FormValues } from "./logic/createForm";
import useSubscribe from "./useSubscribe";
import useUpdate from "./hooks/useUpdate";
import get from "./utils/get";

interface IStateInitializeWatch {
  values: FormValues;
  name: string[];
}

export const initializeWatch = ({
  values,
  name,
}: IStateInitializeWatch) => {
  const data: any[] = [];

  for (const key of name) {
    data.push(get(values, key));
  }

  return data;
};

export const useWatch = (props: { form?: Form; name: string[] }) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, name } = props;
  const _state = useRef<any[]>(
    initializeWatch({ values: form.config.values, name }),
  );
  const update = useUpdate();

  const latestState = useCallback(
    (values: FormValues) => {
      const latestState = initializeWatch({ values, name });
      if (JSON.stringify(_state.current) !== JSON.stringify(latestState)) {
        _state.current = latestState;
        update();
      }
    },
    [name.length],
  );

  useSubscribe({
    form,
    subject: "state",
    callback: latestState,
  });

  return _state.current;
};

export default useWatch;
