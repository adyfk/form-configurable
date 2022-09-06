import { expressionToValue, SchemaField } from 'gateway';

export interface Fields {
  error: Record<string, string>;
  touched: Record<string, boolean>;
  show: Record<string, boolean>;
  editable: Record<string, boolean>;
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

export type FormValues = Record<string, any>;

export type Control = ReturnType<typeof createFormControl>;

export interface CreateFormControlProps {
  schema: SchemaField[];
  extraData?: FormValues;
}

export const createFormControl = (props: CreateFormControlProps) => {
  const _values: FormValues = {};
  const _fields: Fields = {
    error: {},
    touched: {},
    show: {},
    editable: {},
  };
  const _formState: RootFormState = {
    isSubmitted: false,
    isSubmitSuccessful: false,
    isSubmitting: false,
    isValidating: false,
  };
  const _refs: Record<string, any> = {};

  const _subjects: { watchs: any[] } = {
    watchs: [],
  };

  const subscribeWatch = (callback: any) => {
    _subjects.watchs.push(callback);
    return () => {
      _subjects.watchs = _subjects.watchs.filter((fn) => fn !== callback);
    };
  };

  const notifyWatch = () => {
    for (const fn of _subjects.watchs) {
      fn(_values, _fields);
    }
  };

  const hasError = () => !!Object.keys(_fields.error).length;

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
    for (const { expression, name, value } of field.config) {
      if (expression) {
        try {
          const isValid = expressionToValue(expression, {
            ..._values,
            ...props.extraData,
          });
          _fields[name][field.fieldName] = !!isValid as any;
        } catch (error) {
          _fields[name][field.fieldName] = false as any;
        }
      } else {
        _fields[name][field.fieldName] = value;
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
    if (error) _fields.error[fieldName] = error;
    else delete _fields.error[fieldName];
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
    const isPreviousTouched = _fields.touched[name];
    _fields.touched[name] = value;

    if (shoudRender && isPreviousTouched !== value) {
      notifyWatch();
    }
  };

  const onChange = async (name: string, value: any) => {
    _values[name] = value;
    updateTouch(name, true, false);
    // const start = performance.now();

    executeEachField(['override', 'config', 'validate']);
    // const end = performance.now();
    // console.log('time taken', start - end);
    notifyWatch();
  };

  // initialize default values
  const reset = () => {
    for (const field of props.schema) {
      _values[field.fieldName] = field.initialValue;
    }
    for (const field of props.schema) {
      executeExpressionConfig(field);
    }
    notifyWatch();
  };

  reset();

  return {
    values: _values,
    fields: _fields,
    refs: _refs,
    formState: _formState,
    get hasError() {
      return hasError();
    },
    subscribeWatch,
    notifyWatch,
    updateTouch,
    onChange,
    executeEachField,
    reset,
  };
};

export default createFormControl;
