import { Schema } from 'src/types/schema';

const executeEachConfig = (
  schema: Schema[],
  data: Record<any, any>,
  extraData: Record<any, any>
) => {
  for (const config of schema) {
    if (config.variant === 'FIELD') {
      config.initialValue = data[config.fieldName];
    } else if (config.variant === 'GROUP') {
      executeEachConfig(config.child, data, extraData);
    }
  }
};

export const initialize_schema = (
  schema: Schema[],
  data: Record<any, any>,
  extraData?: Record<any, any>
) => {
  const overrideSchema = [...schema];
  executeEachConfig(overrideSchema, data, extraData || {});

  return overrideSchema;
};

export default initialize_schema;
