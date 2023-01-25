/* eslint-disable no-restricted-syntax */
import type { Schema } from '../types/schema';

const initValueEachSchema = (schema: Schema[], values: Record<string, any>) => {
  for (const config of schema) {
    if (config.variant === 'GROUP') {
      if (config.name) {
        config.data = values[config.name];
      }
      config.child = initValueEachSchema([...config.child], values);
    } else if (config.variant === 'FIELD') {
      config.initialValue = values[config.name];
    } else if (config.variant === 'VIEW') {
      if (config.name) {
        config.data = values[config.name];
      }
    }
  }
  return schema;
};

export const generateInitialValues = (
  schema: Schema[],
  values: Record<string, any>,
) => initValueEachSchema([...schema], values);

export default generateInitialValues;
