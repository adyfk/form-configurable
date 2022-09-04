import { expressionToValue, SchemaField } from 'gateway';
import createSubject, { Subject } from './createSubject';

export interface Fields {
  errors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  hiddenFields: Record<string, boolean>;
  disabledFields: Record<string, boolean>;
}

export interface FormState {
  error: boolean;
  touched: boolean;
  // dirty: boolean;
}

export interface RootFormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  isSubmitSuccessful: boolean;
  isValidating: boolean;
}

export type Control = ReturnType<typeof createFormControl>;

export type Subjects = {
  value: Subject;
  state: Subject;
  all: Subject;
};

export interface CreateFormControlProps {
  schema: SchemaField[];
  extraData?: Record<string, any>;
}

export const createFormControl = (props: CreateFormControlProps) => {
  const _values: Record<string, any> = {};
  const _fields: Fields = {
    errors: {},
    touchedFields: {},
    hiddenFields: {},
    disabledFields: {},
  };
  const _formState: RootFormState = {
    isSubmitted: false,
    isSubmitSuccessful: false,
    isSubmitting: false,
    isValidating: false,
  };
  const _refs: Record<string, any> = {};

  const _subjects: Subjects = {
    value: createSubject(),
    state: createSubject(),
    all: createSubject(),
  };

  const hasError = () => !!Object.keys(_fields.errors).length;

  // initialize default values
  const reset = () => {
    for (const field of props.schema) {
      _values[field.fieldName] = field.initialValue;
    }
    _subjects.all.next();
  };

  const executeExpressionOverrideSelf = (field: SchemaField) => {
    if (field.override?.self) {
      try {
        _values[field.fieldName] = expressionToValue(field.override.self, {
          ..._values,
          ...props.extraData,
        });
      } catch (error) {
        //
      }
    }
  };

  const executeExpressionConfig = (field: SchemaField) => {
    for (const configField of field.config) {
      if (!configField.expression) {
        _fields[`${configField.name}Fields`] = configField.value;
      } else {
        try {
          const isValid = expressionToValue(configField.expression, {
            ..._values,
            ...props.extraData,
          });
          _fields[`${configField.name}Fields`] = !!isValid as any;
        } catch (error) {
          //
        }
      }
    }
  };

  const executeExpressionValidate = (field: SchemaField) => {
    let error: any = '';
    const fieldName = field.fieldName;
    for (const rule of field.rules) {
      try {
        const isTrue = !!expressionToValue(rule.expression, {
          ..._values,
          ...props.extraData,
        });
        if (isTrue) {
          error = rule.error;
          break;
        }
      } catch (e: any) {
        error = rule.error;
      }
    }
    if (error) _fields.errors[fieldName] = error;
    else delete _fields.errors[fieldName];
  };

  const executeEachField = (
    eventType: ('override' | 'config' | 'validate')[],
    name?: string
  ) => {
    for (const field of props.schema) {
      if (name === field.fieldName && field.override?.resetValues) {
        Object.assign(_values, field.override?.resetValues);
      }
      if (eventType.includes('override')) {
        executeExpressionOverrideSelf(field);
      }
      if (eventType.includes('config')) {
        executeExpressionConfig(field);
      }
      if (eventType.includes('validate')) {
        executeExpressionValidate(field);
      }
    }
  };

  const updateTouch = (
    name: string,
    value: boolean = true,
    shoudRender: boolean = true
  ) => {
    const isPreviousTouched = _fields.touchedFields[name];
    _fields.touchedFields[name] = value;

    if (shoudRender && isPreviousTouched !== value) {
      _subjects.all.next();
    }
  };

  const onChange = async (name: string, value: any) => {
    _values[name] = value;
    updateTouch(name, true, false);
    // const start = performance.now();

    executeEachField(['override', 'config', 'validate']);
    // const end = performance.now();
    // console.log('time taken', start - end);
    _subjects.all.next();
  };

  reset();

  return {
    subjects: _subjects,
    values: _values,
    fields: _fields,
    refs: _refs,
    formState: _formState,
    get hasError() {
      return hasError();
    },
    updateTouch,
    onChange,
    executeEachField,
    reset,
  };
};

export default createFormControl;
