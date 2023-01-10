import generateId from '../utils/generateId';
import { expressionToValue } from '../parser';
import type { Schema, SchemaFieldType } from '../types/schema';

export interface Props {
  show: Record<string, boolean>;
  editable: Record<string, boolean>;
}

export interface Fields {
  error: Record<string, string>;
  touched: Record<string, boolean>;
}

export interface FormState {
  error: boolean;
  touched: boolean;
}

export interface RootFormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  isSubmitSuccessful: boolean;
  isValidating: boolean;
}

export type FormValues = Record<string, any>;

export interface CreateFormProps {
  schema: Schema[];
  extraData?: FormValues;
  debug?: boolean;
}

const autoGenerateIdConfig = (schema: Schema[]): Schema[] => {
  return schema.map((config) => {
    const tempConfig: Schema = {
      ...config,
      key: generateId(),
    };
    if (tempConfig.variant === 'GROUP') {
      tempConfig.child = autoGenerateIdConfig(tempConfig.child);
    }
    return tempConfig;
  });
};

export const createForm = (props: CreateFormProps) => {
  const _schema: Schema[] = [];
  const _values: FormValues = {};
  const _props: Props = {
    show: {},
    editable: {},
  };
  const _fields: Fields = {
    error: {},
    touched: {},
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
      fn(_values, _fields, _props);
    }
    props.debug && console.log({ _values, _fields, _props, _formState });
  };

  const hasError = () => !Object.keys(_fields.error).length;

  const executeExpressionOverride = (
    config: SchemaFieldType,
    fieldName?: string
  ) => {
    if (fieldName === config.fieldName && config.override?.others) {
      Object.assign(_values, config.override?.others);
    }

    if (config.override?.self) {
      try {
        _values[config.fieldName] = expressionToValue(config.override.self, {
          ..._values,
          ...props.extraData,
        });
      } catch (error) {
        //
      }
    }
  };

  const executeExpressionProps = (config: Schema) => {
    if (!config.props) return;

    for (const { expression, name, value } of config.props) {
      if (expression) {
        try {
          const isValid = expressionToValue(expression, {
            ..._values,
            ...props.extraData,
          });
          _props[name][config.key as string] = !!isValid as any;
        } catch (error) {
          _props[name][config.key as string] = false as any;
        }
      } else {
        _props[name][config.key as string] = value;
      }
    }
  };

  const executeExpressionRule = (config: SchemaFieldType) => {
    if (!config.rules) return;

    delete _fields.error[config.fieldName];

    for (const rule of config.rules) {
      try {
        const isTrue = !!expressionToValue(rule.expression, {
          ..._values,
          ...props.extraData,
        });
        if (isTrue) {
          _fields.error[config.fieldName] = rule.error;
          break;
        }
      } catch (e: any) {
        _fields.error[config.fieldName] = rule.error;
      }
    }
  };

  const executeEachConfig = (
    schema: Schema[],
    eventType: ('override' | 'config' | 'validate')[],
    fieldName?: string
  ) => {
    for (const config of schema) {
      if (config.variant === 'FIELD') {
        if (eventType.includes('override')) {
          executeExpressionOverride(config, fieldName);
        }
        if (eventType.includes('validate')) {
          executeExpressionRule(config);
        }
      } else if (config.variant === 'GROUP') {
        executeEachConfig(config.child, eventType, fieldName);
      }

      if (eventType.includes('config')) {
        executeExpressionProps(config);
      }
    }
  };

  const executeConfig = (
    eventType: ('override' | 'config' | 'validate')[],
    fieldName?: string
  ) => {
    executeEachConfig(_schema, eventType, fieldName);
  };

  const updateTouch = (
    name: string,
    value: boolean = true,
    shouldRender: boolean = true
  ) => {
    const isPreviousTouched = _fields.touched[name];
    _fields.touched[name] = value;

    if (shouldRender && isPreviousTouched !== value) {
      notifyWatch();
    }
  };

  const onChange = async (
    fieldName: string,
    value: any,
    options?: { freeze: boolean }
  ) => {
    _values[fieldName] = value;

    if (options?.freeze) return;

    updateTouch(fieldName, true, false);
    executeConfig(['override', 'config', 'validate'], fieldName);
    notifyWatch();
  };

  const initializeValues = (schema: Schema[]) => {
    for (const config of schema) {
      if (config.variant === 'FIELD') {
        _values[config.fieldName] = config.initialValue;
      } else if (config.variant === 'GROUP') {
        initializeValues(config.child);
      }
    }
  };

  // initialize default values
  const reset = () => {
    // generate key
    Object.assign(_schema, autoGenerateIdConfig(props.schema));
    initializeValues(_schema);

    executeConfig(['config']);

    for (const fieldName in _fields.error) {
      delete _fields.error[fieldName];
    }
    for (const fieldName in _fields.touched) {
      delete _fields.touched[fieldName];
    }
    notifyWatch();
  };

  reset();

  return {
    schema: _schema,
    props: _props,
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
    executeConfig,
    reset,
  };
};

export type Form = ReturnType<typeof createForm>;

export default createForm;
