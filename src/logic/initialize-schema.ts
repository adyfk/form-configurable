/* eslint-disable camelcase */
import type { Schema } from "../types";

const executeEachConfig = (
  schema: Schema[],
  data: Record<any, any>,
  extraData: Record<any, any>,
) => {
  for (const config of schema) {
    if (config.variant === "FIELD") {
      config.initialValue = data[config.name];
    } else if (config.variant === "VIEW") {
      if (config.name) {
        config.data = data[config.name];
      }
    } else if (config.variant === "GROUP") {
      if (config.name) {
        config.data = data[config.name];
      }
      executeEachConfig(config.child, data, extraData);
    }
  }
};

export const initializeSchema = (
  schema: Schema[],
  data: Record<any, any>,
  extraData?: Record<any, any>,
) => {
  const overrideSchema = [...schema];
  executeEachConfig(overrideSchema, data, extraData || {});

  return overrideSchema;
};

export default initializeSchema;
