import {
  useContext,
} from "react";
import { IForm } from "../logic/createForm";
import { FormContext } from "../contexts/FormContext";
import useSubscribeAndCompare from "./useSubscribeAndCompare";

export const useWatchAll = (props: {
  form?: any;
  defaultValue: any;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext } = props as { form: IForm<any> };

  useSubscribeAndCompare({
    form,
    subject: "fields",
  });

  return {
    state: form.state.values,
    form,
  };
};

export default useWatchAll;
