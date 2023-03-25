import {
  createContext,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Form,
  createForm,
  CreateFormProps,
  RootFormState,
} from "./logic/createForm";
// import useUpdate from './hooks/useUpdate';
import { SumbitMiddlewareContext } from "./useSubmitMiddleware";
import { Schema } from "./types";
import useUpdate from "./hooks/useUpdate";

interface IUserFormProps extends CreateFormProps {
  forceSubmitOnError?: boolean;
  // eslint-disable-next-line no-unused-vars
  log?: (...arg: any) => void;
}

export const initializeRootFormState = ({
  isDirty,
  isSubmitSuccessful,
  isSubmitted,
  isValid,
  isSubmitting,
  isValidating,
}: RootFormState) => ({
  isDirty,
  isSubmitSuccessful,
  isSubmitted,
  isValid,
  isSubmitting,
  isValidating,
});

export const useForm = (props: IUserFormProps) => {
  const update = useUpdate();
  const { validateListSubmit, order } = useContext(SumbitMiddlewareContext);
  const _form = useRef<Form>(null as any);
  const _rootFormState = useRef<RootFormState>(null as any);

  if (!_form.current) {
    _form.current = {
      ...createForm(props),
    };
    _rootFormState.current = initializeRootFormState({
      ..._form.current.formState,
    });
  }

  const [schema, setSchema] = useState<Schema[]>([]);

  const getForm = () => _form.current;

  const handleSubmit = useCallback(
    (
      // eslint-disable-next-line no-unused-vars
      onValid: (values: Record<string, any>) => Promise<void> | any,
      // eslint-disable-next-line no-unused-vars
      onInvalid?: (errors: Record<string, any>, values: Record<string, any>, type: "SCHEMA" | "CUSTOM") => Promise<void> | any,
    ) => async (event: FormEvent) => {
      props.log?.("handleSubmit triggered");
      event?.stopPropagation();
      event?.preventDefault();

      const form = getForm();

      try {
        form.setFormState({
          isSubmitting: true,
          isSubmitted: true,
        });
        if (order === "before") {
          props.log?.("run (before) validate list submit");
          await validateListSubmit();
          props.log?.("success (before) validate list submit");
        }

        form.executeConfig();
        if (form.hasError() && !props.forceSubmitOnError) {
          if (props.shouldFocusError) {
            const name = Object.keys(form.fields.error)[0];
            form.setFocus(name);
            props.log?.(`trigger focus ${name}`);
          }
          throw new Error("Error Schema");
        } else {
          await onValid(form.config.values);
        }

        if (order === "after") {
          props.log?.("run (after) validate list submit");
          await validateListSubmit();
          props.log?.("success (after) validate list submit");
        }

        form.setFormState({
          isSubmitting: false,
          isSubmitSuccessful: true,
        });
      } catch (error: any) {
        form.setFormState({
          isSubmitting: false,
          isSubmitSuccessful: false,
        });

        try {
          await onInvalid?.(
            form.fields.error,
            form.config.values,
            error?.message === "Error Schema" ? "SCHEMA" : "CUSTOM",
          );
        } catch (error) {
          //
        }
      } finally {
        form.notifyWatch();
      }
    },
    [props.forceSubmitOnError, order, validateListSubmit],
  );

  useEffect(() => {
    if (!_form.current) return;
    props.log?.("useForm - useEffect - (schema, extraData, initialValues)");
    const form = getForm();

    form.reset({
      schema: props.schema,
      extraData: props.extraData,
      initialValues: props.initialValues,
    });
    setSchema([..._form.current.config.schema]);
    form.setFormState({ ..._form.current.formState });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.schema, props.extraData, props.initialValues]);

  useEffect(() => {
    const form = getForm();

    const latestState = (rootFormState: RootFormState) => {
      const latestState = initializeRootFormState(rootFormState);

      if (JSON.stringify(_rootFormState.current) !== JSON.stringify(latestState)) {
        _rootFormState.current = latestState;
        update();
      }
    };

    const unsubscribe = form.subscribeWatch(latestState, "container");
    return unsubscribe;
  }, [schema]);

  return {
    schema,
    get form() {
      return getForm();
    },
    get formState() {
      return _rootFormState.current;
    },
    handleSubmit,
  };
};

export const FormContext = createContext<ReturnType<typeof useForm>>({} as any);

export default useForm;
