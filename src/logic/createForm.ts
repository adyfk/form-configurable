import generateId from '../utils/generateId';
import { expressionToValue } from '../parser';
import type { Schema, SchemaField, SchemaFieldArray } from '../types';
import set from '../utils/set';
import unset from '../utils/unset';
import get from '../utils/get';

export type Props = {
  show: Record<string, boolean>;
  editable: Record<string, boolean>;
  [key: string]: Record<string, boolean>;
};

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
  // eslint-disable-next-line no-unused-vars
  log?: (arg: { _values: FormValues; _fields: Fields; _props: Props; _formState: RootFormState; }) => void;
}

const autoGenerateIdConfig = (schema: Schema[]): Schema[] => schema.map((config) => {
  const tempConfig: Schema = {
    ...config,
  };

  if (!tempConfig.key) tempConfig.key = generateId();

  if (tempConfig.variant === 'GROUP') {
    tempConfig.child = autoGenerateIdConfig(tempConfig.child);
  }
  return tempConfig;
});

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
    props.log?.({
      _values, _fields, _props, _formState,
    });
  };

  const hasError = () => !!Object.keys(_fields.error).length;

  const isPropsSkipExceute = (config: Schema) => {
    const editable = _props.editable[config.key as string as string];
    const show = _props.show[config.key as string as string];
    if (typeof editable !== 'undefined' && !editable) return true;
    if (typeof show !== 'undefined' && !show) return true;
    return false;
  };

  const executeExpressionOverride = (
    config: SchemaField,
    fieldName?: string,
  ) => {
    if (fieldName === config.fieldName && config.override?.others) {
      Object.assign(_values, config.override?.others);
    }

    if (config.override?.self) {
      try {
        const result = expressionToValue(config.override.self, {
          ..._values,
          ...props.extraData,
        });
        set(_values, config.fieldName, result);
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
          set(_props[name], config.key as string, !!isValid);
        } catch (error) {
          set(_props[name], config.key as string, false);
        }
      } else {
        set(_props[name], config.key as string, value);
      }
    }
  };

  const executeExpressionRule = (config: SchemaField) => {
    if (!config.rules) return;

    unset(_fields.error, config.fieldName);

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
        unset(_fields.error, config.fieldName);
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  const executeExpressionRuleArray = (config: SchemaFieldArray) => {

  };

  const clearErrorEachConfig = (schema: Schema[]) => {
    for (const config of schema) {
      if (config.variant === 'FIELD') {
        unset(_fields.error, config.fieldName);
        unset(_fields.touched, config.fieldName);
      } else if (config.variant === 'GROUP') {
        clearErrorEachConfig(config.child);
      }
    }
  };

  const executeEachConfig = (
    schema: Schema[],
    fieldName?: string,
    options: { skipValidate: boolean } = { skipValidate: false },
  ) => {
    for (const config of schema) {
      if (config.variant === 'FIELD') {
        executeExpressionOverride(config, fieldName);
        executeExpressionProps(config);
        if (isPropsSkipExceute(config)) {
          clearErrorEachConfig([config]);
          continue;
        }

        if (!options.skipValidate) {
          if (config.fieldType === 'ARRAY') {
            executeExpressionRuleArray(config);
          } else {
            executeExpressionRule(config);
          }
        }
      } else if (config.variant === 'GROUP') {
        executeExpressionProps(config);
        if (isPropsSkipExceute(config)) {
          clearErrorEachConfig(config.child);
          continue;
        }

        executeEachConfig(config.child, fieldName, options);
      } else {
        executeExpressionProps(config);
      }
    }
  };

  const executeConfig = (
    fieldName?: string,
    options: { skipValidate: boolean } = { skipValidate: false },
  ) => {
    executeEachConfig(_schema, fieldName, options);
  };

  const updateTouch = (
    name: string,
    value: boolean = true,
    shouldRender: boolean = true,
  ) => {
    const isPreviousTouched = _fields.touched[name];
    _fields.touched[name] = value;

    if (shouldRender && isPreviousTouched !== value) {
      notifyWatch();
    }
  };

  const getValue = (fieldName: string) => get(_values, fieldName);
  const getError = (fieldName: string) => get(_fields.error, fieldName);
  const getTouch = (fieldName: string) => get(_fields.touched, fieldName);

  const setValue = (
    fieldName: string,
    value: any,
    options?: { freeze: boolean },
  ) => {
    set(_values, fieldName, value);

    if (options?.freeze) return;

    updateTouch(fieldName, true, false);
    executeConfig(fieldName);
    notifyWatch();
  };

  const setValues = (
    values: Record<any, any>,
    options?: { freeze: boolean },
  ) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key, value, { freeze: true });
    });

    if (options?.freeze) return;

    executeConfig();
    notifyWatch();
  };

  const setError = (
    fieldName: string,
    value?: any,
    options?: { freeze: boolean },
  ) => {
    if (value) _fields.error[fieldName] = value;
    else unset(_fields.error, fieldName);

    if (options?.freeze) return;
    notifyWatch();
  };

  const setErrors = (
    values: Record<any, any>,
    options?: { freeze: boolean },
  ) => {
    Object.entries(values).forEach(([key, value]) => {
      setError(key, value, { freeze: true });
    });

    if (options?.freeze) return;
    notifyWatch();
  };

  const setFormState = (key: keyof RootFormState, value: boolean) => {
    _formState[key] = value;
  };

  const initializeValues = (schema: Schema[]) => {
    for (const config of schema) {
      if (config.variant === 'FIELD') {
        set(_values, config.fieldName, config.initialValue);
      } else if (config.variant === 'GROUP') {
        initializeValues(config.child);
      }
    }
  };

  // initialize default values
  const initialize = () => {
    // generate key
    Object.assign(_schema, autoGenerateIdConfig(props.schema));
    initializeValues(_schema);

    executeConfig();
    notifyWatch();
  };

  const reset = () => {
    for (const fieldName in _fields.error) {
      unset(_fields.error, fieldName);
    }
    for (const fieldName in _fields.touched) {
      unset(_fields.touched, fieldName);
    }
    notifyWatch();
  };

  initialize();

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
    getValue,
    getError,
    getTouch,
    setValue,
    setValues,
    setError,
    setErrors,
    setFormState,
    executeConfig,
    reset,
  };
};

export type Form = ReturnType<typeof createForm>;

export default createForm;
