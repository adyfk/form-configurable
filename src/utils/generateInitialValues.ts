import type { Schema } from '../types/schema';

const initValueEachSchema = (schema: Schema[], values: Record<string, any>) => {
  for (const config of schema) {
    if (config.variant === 'GROUP') {
      config.child = initValueEachSchema([...config.child], values);
    } else if (config.variant === 'FIELD') {
      config.initialValue = values[config.fieldName];
    } else if (config.variant === 'VIEW') {
    }
  }
  return schema;
};

export const generateInitialValues = (
  schema: Schema[],
  values: Record<string, any>
) => {
  return initValueEachSchema([...schema], values);
};

export default generateInitialValues;
