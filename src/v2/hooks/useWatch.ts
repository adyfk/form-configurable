import {
  useContext,
} from "react";
import { IForm } from "../logic/createForm";
import { FormContext } from "../contexts/FormContext";
import useSubscribeAndCompare from "./useSubscribeAndCompare";

export const useWatch = <T>(props: {
  defaultValue?: any;
  form?: any;
  name: string;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, name } = props as { form: IForm<any>, name: string };

  useSubscribeAndCompare({
    form,
    subject: "fields",
    getState() {
      return form.getValue(name);
    },
  });

  return {
    state: form.getValue(name) as T,
    form,
  };
};

export default useWatch;
