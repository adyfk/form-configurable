import {
  useContext,
} from "react";
import { IForm } from "../logic/createForm";
import { ISchema } from "../types";
import { FormContext } from "../contexts/FormContext";
import useSubscribeAndCompare from "./useSubscribeAndCompare";
// import type { ISchema } from "../../types";

export const useSupport = (props: {
  form?: any;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext } = props as { form: IForm<ISchema> };

  useSubscribeAndCompare({
    form,
    getState() {
      return form.state.supportFormState;
    },
    subject: "supports",
  });

  return {
    form,
    state: form.state.supportFormState,
  };
};

export default useSupport;
