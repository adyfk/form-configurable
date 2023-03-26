/* eslint-disable indent */
import React, { createContext, useMemo } from "react";
import { ISchema } from "../types";
import useForm from "../hooks/useForm";
import ComponentContext, { Components } from "./ComponentContext";

export function createFormContext<T>() {
  return createContext<ReturnType<(typeof useForm<ISchema<T>>)>>({} as any);
}

export const FormContext = createContext<{
  context: React.Context<ReturnType<(typeof useForm<ISchema<any>>)>>
}>({ context: {} as any });

export function FormContextProvider({ context: Context, action, children, components }: {
  context: React.Context<ReturnType<(typeof useForm<ISchema<any>>)>>;
  action: ReturnType<(typeof useForm<ISchema<any>>)>;
  children: any;
  components: Components
}) {
  const contextReference = useMemo(() => ({ context: Context }), [Context]);
  const componentsValue = useMemo(() => ({ components }), [components]);

  return (
    <FormContext.Provider value={contextReference}>
      <Context.Provider value={action}>
        <ComponentContext.Provider value={componentsValue}>
          {children}
        </ComponentContext.Provider>
      </Context.Provider>
    </FormContext.Provider>
  );
}