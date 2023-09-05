import {
  useContext,
} from "react";
import { IForm } from "../logic/createForm";
import { FormContext } from "../contexts/FormContext";
import useSubscribeAndCompare from "./useSubscribeAndCompare";

export const useExtra = <T>(props: {
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
    subject: "extras",
    getState() {
      return form.getExtra(name);
    },
  });

  return {
    state: form.getExtra(name) as T,
    form,
  };
};

export default useExtra;
