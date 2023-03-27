import { createContext } from "react";
import { ISchemaFieldCore } from "../types";

export type IComponentContainer<T = any> = (
  _propsContainer: {
    data: T extends ISchemaFieldCore ?
    NonNullable<T["initialValue"]>[0] extends object ?
    NonNullable<T["initialValue"]>[0] : any
    : any; children: any; schema: T
  }) => any

export type IComponent<T> = (_props: { schema: T }) => any
export type IComponentGroup<T> = (_props: {
  schema: T
  children: any
}) => any
export type IComponentArray<T> = (_props: {
  schema: T
  children: (_propsChildren: {
    value: any[],
    container: IComponentContainer<T>
  }) => any;
}) => any
export type IComponentObject<T> = (_props: {
  schema: T
  children: (_propsChildren: {
    value: Record<string, any>,
    container: IComponentContainer<T>
  }) => any;
}) => any
// Record<IVariant, Record<string, Component<any>>>;
// ;
export type IComponents = {
  FIELD: Record<string, IComponent<any>>;
  VIEW: Record<string, IComponent<any>>;
  GROUP: Record<string, IComponentGroup<any>>;
  "FIELD-ARRAY": Record<string, IComponentArray<any>>;
  "FIELD-OBJECT": Record<string, IComponentObject<any>>;
};

export const ComponentContext = createContext<{ components: IComponents }>({
  components: {
    "FIELD-ARRAY": {},
    "FIELD-OBJECT": {},
    FIELD: {},
    GROUP: {},
    VIEW: {},
  },
});

export default ComponentContext;