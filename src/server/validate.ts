import { expressionToValue, SchemaField } from 'gateway';

export const validate = (
  values: Record<string, any>,
  schema: SchemaField[],
  config?: Partial<{
    onlyFirstError: boolean;
  }>
) => {
  const errors: Record<string, any> = {};
  for (const field of schema) {
    let error: any = '';
    const fieldName = field.fieldName;
    for (const rule of field.rules) {
      try {
        const isTrue = !!expressionToValue(rule.expression, values);
        if (isTrue) {
          error = rule.error;
          break;
        }
      } catch (e: any) {
        error = rule.error;
      }
    }
    if (error) {
      errors[fieldName] = error;
      if (config?.onlyFirstError) {
        break;
      }
    }
  }
  return errors;
};

export default validate;
