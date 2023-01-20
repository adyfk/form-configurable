import { expressionToValue } from '../parser';
import type { Schema, SchemaField } from '../types';

const executeExpressionOverride = (
  config: SchemaField,
  values: Record<any, any>,
  errors: Record<any, any>,
  extraData: Record<any, any>,
) => {
  if (config.override?.self) {
    try {
      values[config.fieldName] = expressionToValue(config.override.self, {
        ...values,
        ...extraData,
      });
    } catch (error) {
      //
    }
  }
};

const executeExpressionRule = (
  config: SchemaField,
  values: Record<any, any>,
  errors: Record<any, any>,
  extraData: Record<any, any>,
) => {
  if (!config.rules) return;
  delete errors[config.fieldName];

  for (const rule of config.rules) {
    try {
      const isTrue = expressionToValue(rule.expression, {
        ...values,
        ...extraData,
      });
      if (isTrue) {
        errors[config.fieldName] = rule.error;
        break;
      }
    } catch (e: any) {
      delete errors[config.fieldName];
    }
  }
};

const executeEachConfig = (
  schema: Schema[],
  values: Record<any, any>,
  errors: Record<any, any>,
  extraData: Record<any, any>,
) => {
  for (const config of schema) {
    if (config.variant === 'FIELD') {
      executeExpressionOverride(config, values, errors, extraData);
      executeExpressionRule(config, values, errors, extraData);
    } else if (config.variant === 'GROUP') {
      executeEachConfig(config.child, values, errors, extraData);
    }
  }
};

export const validate = (
  schema: Schema[],
  data: Record<any, any>,
  extraData?: Record<any, any>,
) => {
  const errors: Record<any, any> = {};
  const values = { ...data };

  executeEachConfig(schema, values, errors, extraData || {});
  return errors;
};

export default validate;
