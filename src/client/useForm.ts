import { FormEvent, useRef, useState } from 'react';
import {
  Control,
  createFormControl,
  CreateFormControlProps,
  RootFormState,
} from './createFormControl';

export const useForm = (props: CreateFormControlProps) => {
  const _formControl = useRef<Control>(createFormControl(props));
  const [formState, setFormState] = useState<RootFormState>(
    _formControl.current.formState
  );

  const getFormControl = () => _formControl.current;

  const updateFormState = (values: Partial<RootFormState>) => {
    setFormState((prev) => {
      const latestFormState = {
        ...prev,
        ...values,
      };
      _formControl.current.formState = latestFormState;
      return latestFormState;
    });
  };

  const handleSubmit =
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
        const formControl = getFormControl();
        updateFormState({
          isSubmitting: true,
          isSubmitted: true,
        });
        formControl.executeEachField(['validate']);

        if (formControl.hasError) {
          await onInvalid?.(formControl.fields.errors, formControl.values);
        } else {
          await onValid(formControl.values);
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
        _formControl.current.subjects.all.next();
      }
    };

  return {
    fields: props.schema,
    control: _formControl.current,
    formState,
    handleSubmit,
  };
};

export default useForm;
