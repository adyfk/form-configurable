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
  schema?: Schema[];
  extraData?: FormValues;
  // eslint-disable-next-line no-unused-vars
  log?: (...arg: any) => void;
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
  const _config: {
    schema: Schema[];
    extraData: FormValues;
  } = {
    schema: [],
    extraData: {},
  };
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
  };

  const hasError = () => !!Object.keys(_fields.error).length;

  function getValue(name: string) { return get(_values, name); }
  function getError(name: string) { return _fields.error[name]; }
  function getTouch(name: string) { return _fields.touched[name]; }
  function getProp(name: string, key: string) {
    const value = _props[name]?.[key];
    return (typeof value === 'undefined' || value);
  }
  // function unsetValue(name: string) { unset(_values, name); }
  function unsetError(name: string) { delete _fields.error[name]; }
  // eslint-disable-next-line no-unused-vars
  function unsetTouch(name: string) { delete _fields.touched[name]; }
  // function unsetProp(name: string, key: string) { delete _props[name][key]; }
  function initValue(name: string, value: any) { set(_values, name, value); }
  function initError(name: string, value: any) { _fields.error[name] = value; }
  function initTouched(name: string, value: any) { _fields.touched[name] = value; }
  function initProp(name: string, key: string, value: any) {
    if (!_props[name]) _props[name] = {};

    _props[name][key] = value;
  }

  const isPropsSkipExceute = (config: Schema, options: IOptionsEachSchema = {}) => {
    const path = (options.path || config.name || config.key) as string;

    const editable = getProp('editable', path);
    const show = getProp('show', path);
    if (!editable) return true;
    if (!show) return true;
    return false;
  };

  const executeExpressionOverride = (
    config: SchemaField,
    name?: string,
    options: IOptionsEachSchema = {},
  ) => {
    const path = options.path || config.name;

    if (typeof name === 'string' && path.includes(name) && config.override?.others) {
      Object.assign(_values, config.override?.others);
    }

    if (config.override?.self) {
      try {
        const result = expressionToValue(config.override.self, {
          ..._values,
          ..._config.extraData,
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

    const path = (options.path || config.name || config.key) as string;
    try {
      for (const { expression, name, value } of config.props) {
        if (expression) {
          try {
            const isValid = expressionToValue(expression, {
              ..._values,
              ..._config.extraData,
              ...options.extraData,
            });
            initProp(name, path, !!isValid);
          } catch (error) {
            initProp(name, path, false);
          }
        } else {
          initProp(name, path, value);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      props.log?.('error on executeExpressionProps', error, {
        info: {
          path,
          option: options,
          config,
        },
      });
    }
  };

  const executeExpressionRule = (config: SchemaField, options: IOptionsEachSchema = {}) => {
    if (!config.rules) return;

    const path = options?.path || config.name;

    for (const rule of config.rules) {
      if (rule.catch) {
        try {
          const isTrue = expressionToValue(rule.expression, {
            ..._values,
            ..._config.extraData,
            ...options.extraData,
          });
          if (!isTrue) {
            initError(path, rule.catch);
            break;
          }
        } catch (e: any) {
          initError(path, rule.catch);
        }
      } else {
        try {
          const isTrue = expressionToValue(rule.expression, {
            ..._values,
            ..._config.extraData,
            ...options.extraData,
          });
          if (isTrue) {
            initError(path, rule.error);
            break;
          }
        } catch (e: any) {
          //
        }
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  const executeExpressionEachArray = (
    config: SchemaFieldArray,
    options: { skipValidate?: boolean; name?: string; parent?: string } = {},
  ) => {
    const path = (options.parent || '') + (options.name || config.name);
    const hasError = getError(path);
    if (hasError) return;

    const value = getValue(path) || [];
    for (let index = 0; index < value.length; index++) {
      for (const childConfig of config.child) {
        const eachOptions = {
          path: createPath({
            parent: path,
            index,
            child: (childConfig as any).name || childConfig.key,
          }),
          extraData: {
            __INDEX__: index,
          },
        };
        if (childConfig.variant === 'FIELD') {
          executeExpressionOverride(childConfig, options.name, eachOptions);
          executeExpressionProps(childConfig, eachOptions);

          if (isPropsSkipExceute(childConfig, eachOptions)) { continue; }

          if (!options.skipValidate) {
            executeExpressionRule(childConfig, eachOptions);
          }
        } else if (childConfig.variant === 'GROUP') {
          //
        } else {
          executeExpressionProps(childConfig, eachOptions);
        }
      }
    }
  };

  const executeEachConfig = (
    schema: Schema[],
    name?: string,
    options: { skipValidate: boolean; parent?: string } = { skipValidate: false },
  ) => {
    try {
      for (const config of schema) {
        if (config.variant === 'FIELD') {
          executeExpressionOverride(config, name);
          executeExpressionProps(config);
          if (isPropsSkipExceute(config)) continue;

          if (!options.skipValidate) {
            executeExpressionRule(config);
          }

          if (config.fieldType === 'ARRAY') {
            executeExpressionEachArray(config, {
              name: config.name,
              skipValidate: options.skipValidate,
            });
          }
        } else if (config.variant === 'GROUP') {
          executeExpressionProps(config);
          if (isPropsSkipExceute(config)) {
            continue;
          }

          executeEachConfig(config.child, name, options);
        } else {
          executeExpressionProps(config);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      props.log?.('error on executeEachConfig', error);
    }
  };

  const executeConfig = (
    name?: string,
    options: { skipValidate: boolean } = { skipValidate: false },
  ) => {
    _fields.error = {};
    _props.editable = {};
    _props.show = {};
    executeEachConfig(_config.schema, name, options);
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
    name: string,
    value: any,
    options?: { freeze: boolean },
  ) => {
    initValue(name, value);

    if (options?.freeze) return;

    updateTouch(name, true, false);
    executeConfig(name);
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
    name: string,
    value?: any,
    options?: { freeze: boolean },
  ) {
    if (value) initError(name, value);
    else unsetError(name);

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
    try {
      for (const config of schema) {
        if (config.variant === 'FIELD') {
          set(_values, config.name, config.initialValue);
        } else if (config.variant === 'GROUP') {
          initializeValues(config.child);
        }
      }
    } catch (error) {
      props.log?.('error on initializeValues', error);
    }
  };

  // initialize default values
  const initialize = (arg: CreateFormProps = { }) => {
    try {
      _fields.error = {};
      _fields.touched = {};
      _formState.isSubmitSuccessful = false;
      _formState.isSubmitted = false;
      _formState.isSubmitting = false;
      _formState.isValidating = false;
      _config.schema = autoGenerateIdConfig((arg.schema || props.schema) || []);
      _config.extraData = arg.extraData || props.extraData || {};

      initializeValues(_config.schema);
      executeConfig();
      notifyWatch();
    } catch (error) {
      props.log?.('error on initialize', error);
    }
  };

  const reset = initialize;

  initialize();

  return {
    schema: _config.schema,
    props: _props,
    values: _values,
    fields: _fields,
    refs: _refs,
    formState: _formState,
    subjects: _subjects,
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
