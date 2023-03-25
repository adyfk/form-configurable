import { createContext } from "react";
import { ISchema } from "../types";

export type Component<T> = (_props: { schema: T }) => any
export type ComponentGroup<T> = (_props: {
  schema: T
  schemas: ISchema[],
  children: any
}) => any
export type ComponentArray<T> = (_props: {
  schema: T
  schemas: ISchema[],
  children: (_propsChildren: {
    value: any[],
    container: (_propsContainer: { data: any; children: any }) => any
  }) => any;
}) => any
export type ComponentObject<T> = (_props: {
  schema: T
  schemas: ISchema[],
  children: (_propsChildren: {
    value: Record<string, any>,
    container: (_propsContainer: { data: any; children: any }) => any
  }) => any;
}) => any
// Record<IVariant, Record<string, Component<any>>>;
// ;
export type Components = {
  FIELD: Record<string, Component<any>>;
  VIEW: Record<string, Component<any>>;
  GROUP: Record<string, ComponentGroup<any>>;
  "FIELD-ARRAY": Record<string, ComponentArray<any>>;
  "FIELD-OBJECT": Record<string, ComponentObject<any>>;
};

const ComponentContext = createContext<{ components: Components }>({
  components: {
    "FIELD-ARRAY": {},
    "FIELD-OBJECT": {},
    FIELD: {},
    GROUP: {},
    VIEW: {},
  },
});

export default ComponentContext;