import { createContext, FC } from "react";
import { ISchemaFieldCore } from "../types";

export type IComponentContainerProps<T = any> = {
  data: T extends ISchemaFieldCore ?
  NonNullable<T["initialValue"]>[0] extends object ?
  NonNullable<T["initialValue"]>[0] : any
  : any;
  children: any;
  schema: T;
  index: number;
  containerProps?: Record<string, any>;
}

export type IComponentProps<T> = {
  schema: T;
  wrapper?: any;
  schemas?: any[];
};
export type IComponentGroupProps<T> = {
  schema: T;
  wrapper?: any;
  children: any;
  schemas?: any[];
};
export type IComponentArrayProps<T> = {
  schema: T;
  wrapper?: any;
  schemas?: any[];
  children: FC<{
    value: any[],
    container: FC<IComponentContainerProps<T>>;
    containerProps?: Record<string, any>
  }>
};
export type IComponentObjectProps<T> = {
  schema: T;
  wrapper?: any;
  schemas?: any[];
  children: FC<{
    value: Record<string, any>,
    container: FC<IComponentContainerProps<T>>
    containerProps?: Record<string, any>
  }>
};
// Record<IVariant, Record<string, Component<any>>>;
// ;
export type IComponents = {
  FIELD: Record<string, FC<IComponentProps<any>>>;
  VIEW: Record<string, FC<IComponentProps<any>>>;
  GROUP: Record<string, FC<IComponentGroupProps<any>>>;
  "FIELD-ARRAY": Record<string, FC<IComponentArrayProps<any>>>;
  "FIELD-OBJECT": Record<string, FC<IComponentObjectProps<any>>>;
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