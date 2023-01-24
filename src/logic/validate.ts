import { Schema } from '../types';
import createForm from './createForm';

export const validate = (
  schema: Schema[],
  data: Record<any, any>,
  extraData?: Record<any, any>,
) => {
  const form = createForm({ schema });

  form.setValues({ ...data, ...extraData });

  return form.fields.error;
};

export default validate;
