import createPath from '../utils/createPath';
import generateId from '../utils/generateId';
import { expressionToValue } from '../parser';
import type { Schema, SchemaField, SchemaFieldArray } from '../types';
import set from '../utils/set';
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

type IOptionsEachSchema = { path?: string; extraData?: Record<string, any> }

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

  function getValue(fieldName: string) { return get(_values, fieldName); }
  function getError(fieldName: string) { return _fields.error[fieldName]; }
  function getTouch(fieldName: string) { return _fields.touched[fieldName]; }
  // function unsetValue(fieldName: string) { unset(_values, fieldName); }
  function unsetError(fieldName: string) { delete _fields.error[fieldName]; }
  function unsetTouch(fieldName: string) { delete _fields.touched[fieldName]; }
  function initValue(fieldName: string, value: any) { set(_values, fieldName, value); }
  function initError(fieldName: string, value: any) { _fields.error[fieldName] = value; }
  function initTouched(fieldName: string, value: any) { _fields.touched[fieldName] = value; }

  const isPropsSkipExceute = (config: Schema, options: IOptionsEachSchema = {}) => {
    const path = options.path || config.key;

    const editable = _props.editable[path as any];
    const show = _props.show[path as any];
    if (typeof editable !== 'undefined' && !editable) return true;
    if (typeof show !== 'undefined' && !show) return true;
    return false;
  };

  const executeExpressionOverride = (
    config: SchemaField,
    fieldName?: string,
    options: IOptionsEachSchema = {},
  ) => {
    const path = options.path || config.fieldName;

    if (typeof fieldName === 'string' && path.includes(fieldName) && config.override?.others) {
      Object.assign(_values, config.override?.others);
    }

    if (config.override?.self) {
      try {
        const result = expressionToValue(config.override.self, {
          ..._values,
          ...props.extraData,
          ...options.extraData,
        });
        initValue(path, result);
      } catch (error) {
        //
      }
    }
  };

  const executeExpressionProps = (
    config: Schema,
    options: IOptionsEachSchema = {},
  ) => {
    if (!config.props) return;

    const path = options.path || config.key;

    for (const { expression, name, value } of config.props) {
      if (!_props[name]) _props[name] = {};

      if (expression) {
        try {
          const isValid = expressionToValue(expression, {
            ..._values,
            ...props.extraData,
          });
          _props[name][path as string] = !!isValid;
        } catch (error) {
          _props[name][path as string] = false;
        }
      } else {
        _props[name][path as string] = value;
      }
    }
  };

  const executeExpressionRule = (config: SchemaField, options: IOptionsEachSchema = {}) => {
    if (!config.rules) return;

    const path = options?.path || config.fieldName;
    unsetError(path);

    for (const rule of config.rules) {
      try {
        const isTrue = expressionToValue(rule.expression, {
          ..._values,
          ...props.extraData,
          ...options.extraData,
        });
        if (isTrue) {
          initError(path, rule.error);
          break;
        }
      } catch (e: any) {
        unsetError(path);
      }
    }
  };

  const clearErrorEachConfig = (schema: Schema[]) => {
    for (const config of schema) {
      if (config.variant === 'FIELD') {
        unsetError(config.fieldName);
        unsetTouch(config.fieldName);
      } else if (config.variant === 'GROUP') {
        clearErrorEachConfig(config.child);
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  const executeExpressionEachArray = (
    config: SchemaFieldArray,
    options: { skipValidate?: boolean; fieldName?: string; parent?: string } = {},
  ) => {
    const path = (options.parent || '') + (options.fieldName || config.fieldName);
    const hasError = getError(path);
    if (hasError) return;

    const value = getValue(path) || [];

    for (let index = 0; index < value.length; index++) {
      for (const childConfig of config.child) {
        const eachKeyOptions = {
          path: createPath({
            parent: path,
            index,
            child: childConfig.key,
          }),
          extraData: {
            __INDEX__: index,
          },
        };

        if (childConfig.variant === 'FIELD') {
          const eachFieldNameOptions = {
            path: createPath({
              parent: path,
              index,
              child: childConfig.fieldName,
            }),
            extraData: {
              __INDEX__: index,
            },
          };
          executeExpressionOverride(childConfig, options.fieldName, eachFieldNameOptions);
          executeExpressionProps(childConfig, eachKeyOptions);
          if (isPropsSkipExceute(childConfig, eachKeyOptions)) {
            clearErrorEachConfig([childConfig]);
            continue;
          }
          if (!options.skipValidate) {
            executeExpressionRule(childConfig, eachFieldNameOptions);
          }
        } else if (childConfig.variant === 'GROUP') {
          //
        } else {
          executeExpressionProps(childConfig, eachKeyOptions);
        }
      }
    }
  };

  const executeEachConfig = (
    schema: Schema[],
    fieldName?: string,
    options: { skipValidate: boolean; parent?: string } = { skipValidate: false },
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
          executeExpressionRule(config);
        }

        if (config.fieldType === 'ARRAY') {
          executeExpressionEachArray(config, {
            fieldName: config.fieldName,
            skipValidate: options.skipValidate,
          });
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
    const isPreviousTouched = getTouch(name);
    initTouched(name, value);

    if (shouldRender && isPreviousTouched !== value) {
      notifyWatch();
    }
  };

  const setValue = (
    fieldName: string,
    value: any,
    options?: { freeze: boolean },
  ) => {
    initValue(fieldName, value);

    if (options?.freeze) return;

    updateTouch(fieldName, true, false);
    executeConfig(fieldName);
    notifyWatch();
  };

  function setValues(
    values: Record<any, any>,
    options?: { freeze: boolean },
  ) {
    Object.entries(values).forEach(([key, value]) => {
      initValue(key, value);
    });

    if (options?.freeze) return;

    executeConfig();
    notifyWatch();
  }

  function setError(
    fieldName: string,
    value?: any,
    options?: { freeze: boolean },
  ) {
    if (value) initError(fieldName, value);
    else unsetError(fieldName);

    if (options?.freeze) return;
    notifyWatch();
  }

  const setErrors = (
    values: Record<any, any>,
    options?: { freeze: boolean },
  ) => {
    Object.entries(values).forEach(([key, value]) => {
      initError(key, value);
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
      unsetError(fieldName);
    }
    for (const fieldName in _fields.touched) {
      unsetTouch(fieldName);
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
