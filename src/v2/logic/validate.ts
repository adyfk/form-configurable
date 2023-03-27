import { ISchema } from "../types";
import createForm from "./createForm";

export const validate = <T = null>(
  schemas: ISchema<T>[],
  values: Record<any, any> = {},
  extraData: Record<any, any> = {},
) => {
  const form = createForm({ schemas, initialValues: values, extraData });

  return form.state.error;
};

export default validate;
