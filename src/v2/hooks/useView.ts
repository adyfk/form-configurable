import { useContext } from "react";
import { IDefaultProp, ISchemaCore } from "../types";
import { IForm } from "../logic/createForm";
import { FormContext } from "../contexts/FormContext";
import useSubscribeAndCompare from "./useSubscribeAndCompare";

export const useView = <TSchema extends ISchemaCore>(props: {
  form?: any;
  schema: TSchema;
  // eslint-disable-next-line no-unused-vars
  log?: () => void;
}) => {
  const { form: formContext } = useContext(FormContext);
  const { form = formContext, schema } = props as { form: IForm<TSchema>, schema: TSchema };

  useSubscribeAndCompare({
    form,
    subject: "fields",
    getState() {
      return form.getSchemaViewState<TSchema["propStateType"] & IDefaultProp>(schema as any);
    },
  });

  return {
    state: form.getSchemaViewState<TSchema["propStateType"] & IDefaultProp>(schema as any),
    data: schema.config?.data || {},
    form,
  };
};

export default useView;
