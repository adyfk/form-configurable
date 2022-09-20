import { expressionToValue } from '../parser';
import { Schema } from '../types/schema';

const validateEachSchema = (
  schema: Schema[],
  values: Record<string, any>,
  errors: Record<string, any>,
  configOptions: any
) => {
  for (const config of schema) {
    if (config.variant === 'GROUP') {
      validateEachSchema(config.child, values, errors, configOptions);
    } else if (config.variant === 'FIELD') {
      if (!config.rules) continue;

      for (const rule of config.rules) {
        try {
          const isTrue = !!expressionToValue(rule.expression, values);
          if (isTrue) {
            errors[config.fieldName] = rule.error;
            break;
          }
        } catch (e: any) {
          errors[config.fieldName] = rule.error;
        }
      }
      if (errors[config.fieldName] && configOptions?.onlyFirstError) {
        break;
      }
    }
  }
};

export const validate = (
  schema: Schema[],
  values: Record<string, any>,
  configOptions: Partial<{
    onlyFirstError: boolean;
  }> = {
    onlyFirstError: true,
  }
) => {
  const errors: Record<string, any> = {};
  validateEachSchema(schema, values, errors, configOptions);
  return errors;
};

export default validate;
