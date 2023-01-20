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
import useUpdate from './hooks/useUpdate';
import { SumbitMiddlewareContext } from './useSubmitMiddleware';

export const useForm = (
  props: CreateFormProps & {
    forceSubmitOnError?: boolean;
  },
) => {
  const update = useUpdate();
  const { validateListSubmit, order } = useContext(SumbitMiddlewareContext);
  const _form = useRef<Form>(createForm(props));

  const [formState, setFormState] = useState<RootFormState>({} as any);

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
      event?.stopPropagation();
      event?.preventDefault();

      const form = getForm();

      try {
        updateFormState({
          isSubmitting: true,
          isSubmitted: true,
        });
        if (order === 'before') {
          await validateListSubmit();
        }

        form.executeConfig();
        if (form.hasError && !props.forceSubmitOnError) {
          throw new Error('Error Schema');
        } else {
          await onValid(form.values);
        }

        if (order === 'after') {
          await validateListSubmit();
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
    _form.current = createForm(props);
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.schema, props.extraData]);

  return {
    schema: _form.current.schema,
    form: _form.current,
    formState,
    handleSubmit,
  };
};

export const FormContext = createContext<ReturnType<typeof useForm>>({} as any);

export default useForm;
