/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SchemaField } from './types';
import { Form } from './logic/createForm';

interface IFormRegisterContext {
  listSubmit: any[];
  addListSubmit: (callback: any) => void;
  removeListSubmit: (callback: any) => void;
  validateListSubmit: () => Promise<any>;
  order: 'before' | 'after';
}

export const SumbitMiddlewareContext = createContext<IFormRegisterContext>({
  listSubmit: [],
} as any);

export const SumbitMiddlewareContextProvider: FC<
  {
    children: any;
  } & Pick<IFormRegisterContext, 'order'>
> = ({ children, order }) => {
  const [listSubmit, setListSubmit] = useState<any[]>([]);

  const addListSubmit = useCallback(
    (callback: any) => {
      setListSubmit((prev) => [...prev, callback]);
    },
    [setListSubmit],
  );

  const removeListSubmit = useCallback(
    (callback: any) => {
      setListSubmit((prev) => prev.filter((func) => func !== callback));
    },
    [setListSubmit],
  );

  const validateListSubmit = useCallback(() => {
    if (!listSubmit.length) return Promise.resolve();

    const listSubmitWrapper = listSubmit.map(
      // eslint-disable-next-line no-promise-executor-return
      (handleSubmit) => new Promise((resolve, reject) => handleSubmit(resolve, reject)({})),
    );

    return Promise.race(listSubmitWrapper);
  }, [listSubmit]);

  const submitMiddlewareContextValue = useMemo(() => ({
    listSubmit,
    addListSubmit,
    removeListSubmit,
    validateListSubmit,
    order,
  }), [listSubmit, order]);

  return (
    <SumbitMiddlewareContext.Provider
      value={submitMiddlewareContextValue}
    >
      {children}
    </SumbitMiddlewareContext.Provider>
  );
};

interface IUserRegisterProps {
  handleSubmit: any;
}

export const useSubmitMiddleware = (props: IUserRegisterProps) => {
  const { addListSubmit, removeListSubmit } = useContext(
    SumbitMiddlewareContext,
  );
  useEffect(() => {
    const { handleSubmit } = props;
    addListSubmit(handleSubmit);
    return () => removeListSubmit(handleSubmit);
  }, [props.handleSubmit, addListSubmit, removeListSubmit]);
};

export function withSubmitMiddleware<T extends object>(
  Child: React.ComponentType<T>,
  config: Pick<IFormRegisterContext, 'order'>,
) {
  const displayName = Child.displayName || Child.name || 'Component';
  function Component(props: T) {
    return (
      <SumbitMiddlewareContextProvider order={config.order || 'before'}>
        <Child {...props} />
      </SumbitMiddlewareContextProvider>
    );
  }
  Component.displayName = `withTheme(${displayName})`;
  return Component;
}

export const resolverMiddleware = ({ resolver, form }: { resolver: any; form: Form }): any => async (values: any) => {
  try {
    return await resolver(
      {
        ...values,
        parent: form.config.values,
      },
      {},
      {},
    );
  } catch (error) {
    return error;
  }
};

export function FormSyncReactHookForm({
  action,
  config,
  form,
}: {
  action: any;
  config: SchemaField;
  form: Form;
}) {
  useSubmitMiddleware({
    handleSubmit: action.handleSubmit,
  });

  const value = action.watch();

  useEffect(() => {
    form.setValue(config.name, value, { freeze: true });
  }, [value, form, config]);

  return <></>;
}

export default useSubmitMiddleware;
