import {
  createContext,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Form,
  createForm,
  CreateFormProps,
  RootFormState,
} from './logic/createForm';
// import useUpdate from './hooks/useUpdate';
import { SumbitMiddlewareContext } from './useSubmitMiddleware';
import { Schema } from './types';

interface IUserFormProps extends CreateFormProps {
  forceSubmitOnError?: boolean;
  // eslint-disable-next-line no-unused-vars
  log?: (...arg: any) => void;
}

export const useForm = (props: IUserFormProps) => {
  const { validateListSubmit, order } = useContext(SumbitMiddlewareContext);
  const _form = useRef<Form>(null as any);

  if (!_form.current) {
    _form.current = {
      ...createForm(props),
    };
  }

  const [formState, setFormState] = useState<RootFormState>({} as any);
  const [schema, setSchema] = useState<Schema[]>([]);

  const getForm = () => _form.current;

  const updateFormState = useCallback((values: Partial<RootFormState>) => {
    setFormState((prev) => {
      const latestFormState = {
        ...prev,
        ...values,
      };
      _form.current.formState = latestFormState;
      return latestFormState;
    });
  }, []);

  const handleSubmit = useCallback(
    (
      // eslint-disable-next-line no-unused-vars
      onValid: (values: Record<string, any>) => Promise<void> | any,
      // eslint-disable-next-line no-unused-vars
      onInvalid?: (errors: Record<string, any>, values: Record<string, any>, type: 'SCHEMA' | 'CUSTOM') => Promise<void> | any,
    ) => async (event: FormEvent) => {
      props.log?.('handleSubmit triggered');
      event?.stopPropagation();
      event?.preventDefault();

      const form = getForm();

      try {
        updateFormState({
          isSubmitting: true,
          isSubmitted: true,
        });
        if (order === 'before') {
          props.log?.('run (before) validate list submit');
          await validateListSubmit();
          props.log?.('success (before) validate list submit');
        }

        form.executeConfig();
        if (form.hasError() && !props.forceSubmitOnError) {
          if (props.shouldFocusError) {
            const name = Object.keys(form.fields.error)[0];
            form.setFocus(name);
            props.log?.(`trigger focus ${name}`);
          }
          throw new Error('Error Schema');
        } else {
          await onValid(form.values);
        }

        if (order === 'after') {
          props.log?.('run (after) validate list submit');
          await validateListSubmit();
          props.log?.('success (after) validate list submit');
        }

        updateFormState({
          isSubmitting: false,
          isSubmitSuccessful: true,
        });
      } catch (error: any) {
        updateFormState({
          isSubmitting: false,
          isSubmitSuccessful: false,
        });

        try {
          await onInvalid?.(
            form.fields.error,
            form.values,
            error?.message === 'Error Schema' ? 'SCHEMA' : 'CUSTOM',
          );
        } catch (error) {
          //
        }
      } finally {
        _form.current.notifyWatch();
      }
    },
    [props.forceSubmitOnError, updateFormState, order, validateListSubmit],
  );

  useEffect(() => {
    if (!_form.current) return;

    props.log?.('useForm - useEffect - (schema, extraData, initialValues)');
    _form.current.reset({
      schema: props.schema,
      extraData: props.extraData,
      initialValues: props.initialValues,
    });
    setSchema([..._form.current.config.schema]);
    setFormState({ ..._form.current.formState });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.schema, props.extraData, props.initialValues]);

  return {
    schema,
    get form() {
      return getForm();
    },
    formState,
    handleSubmit,
  };
};

export const FormContext = createContext<ReturnType<typeof useForm>>({} as any);

export default useForm;
