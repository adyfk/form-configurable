import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { SchemaFieldType } from './types/schema';
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
    [setListSubmit]
  );

  const removeListSubmit = useCallback(
    (callback: any) => {
      setListSubmit((prev) => prev.filter((func) => func !== callback));
    },
    [setListSubmit]
  );

  const validateListSubmit = useCallback(() => {
    if (!listSubmit.length) return Promise.resolve();

    const listSubmitWrapper = listSubmit.map(
      (handleSubmit) =>
        new Promise((resolve, reject) => {
          return handleSubmit(resolve, reject)({});
        })
    );

    return Promise.race(listSubmitWrapper);
  }, [listSubmit]);

  return (
    <SumbitMiddlewareContext.Provider
      value={{
        listSubmit,
        addListSubmit,
        removeListSubmit,
        validateListSubmit,
        order,
      }}
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
    SumbitMiddlewareContext
  );
  useEffect(() => {
    addListSubmit(props.handleSubmit);
    return () => removeListSubmit(props.handleSubmit);
  }, [props.handleSubmit, addListSubmit, removeListSubmit]);
};

export function withSubmitMiddleware<T extends object>(
  Child: React.ComponentType<T>,
  config: Pick<IFormRegisterContext, 'order'>
) {
  const displayName = Child.displayName || Child.name || 'Component';
  const Component = (props: T) => {
    return (
      <SumbitMiddlewareContextProvider order={config.order || 'before'}>
        <Child {...props} />
      </SumbitMiddlewareContextProvider>
    );
  };
  Component.displayName = `withTheme(${displayName})`;
  return Component;
}

export const resolverMiddleware =
  ({ resolver, form }: { resolver: any; form: Form }): any =>
  async (values: any) => {
    try {
      return await resolver(
        {
          ...values,
          parent: form.values,
        },
        {},
        {}
      );
    } catch (error) {
      return error;
    }
  };

export const FormSyncReactHookForm = ({
  action,
  config,
  form,
}: {
  action: any;
  config: SchemaFieldType;
  form: Form;
}) => {
  useSubmitMiddleware({
    handleSubmit: action.handleSubmit,
  });

  const value = action.watch();

  useEffect(() => {
    form.setValue(config.fieldName, value, { freeze: true });
  }, [value, form, config]);

  return <></>;
};

export default useSubmitMiddleware;
