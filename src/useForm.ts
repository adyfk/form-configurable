import {
  createContext,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useUpdate } from 'react-use';
import {
  Form,
  createForm,
  CreateFormProps,
  RootFormState,
} from './logic/createForm';

export const useForm = (
  props: CreateFormProps & {
    forceSubmitOnError?: boolean;
  }
) => {
  const update = useUpdate();
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
        onValid: (values: Record<string, any>) => Promise<void> | any,
        onInvalid?: (
          errors: Record<string, any>,
          values: Record<string, any>
        ) => Promise<void> | any
      ) =>
      async (event: FormEvent) => {
        event.stopPropagation();
        event.preventDefault();
        try {
          const form = getForm();
          updateFormState({
            isSubmitting: true,
            isSubmitted: true,
          });
          form.executeConfig(['validate']);
          if (form.hasError && !props.forceSubmitOnError) {
            await onInvalid?.(form.fields.error, form.values);
            throw new Error('Submit Failed Has Error');
          } else {
            await onValid(form.values);
          }
          updateFormState({
            isSubmitting: false,
            isSubmitSuccessful: true,
          });
        } catch (error) {
          updateFormState({
            isSubmitting: false,
            isSubmitSuccessful: false,
          });
        } finally {
          _form.current.notifyWatch();
        }
      },
    [props.forceSubmitOnError, updateFormState]
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
