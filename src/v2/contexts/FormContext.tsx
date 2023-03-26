import { FC, createContext, useMemo } from "react";
import useForm from "../hooks/useForm";
import ComponentContext, { Components } from "./ComponentContext";

export const FormContext = createContext<ReturnType<(typeof useForm<any>)>>({} as any);

export const FormContextProvider: FC<{
  value: any;
  components: Components;
  children: any;
}> = ({ value, components, children }) => {
  const componentContext = useMemo(() => ({ components }), [components]);

  return (
    <FormContext.Provider value={value}>
      <ComponentContext.Provider value={componentContext}>
        {children}
      </ComponentContext.Provider>
    </FormContext.Provider>
  );
};