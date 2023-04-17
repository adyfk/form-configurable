import { useContext } from "react";
import { IForm } from "../logic/createForm";
import { FormContext } from "../contexts/FormContext";
import { ISchema } from "../types";
import useSubscribeAndCompare from "./useSubscribeAndCompare";
// import type { ISchema } from "../../types";

export const useContainer = (props: {
  form?: any;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext } = props as { form: IForm<ISchema> };

  useSubscribeAndCompare({
    form,
    subject: "containers",
  });

  return {
    form,
    state: form.state.containerFormState,
  };
};

export default useContainer;
