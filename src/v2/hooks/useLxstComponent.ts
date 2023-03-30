import { useEffect, useState } from "react";
import { ISchemaCore, IVariant } from "../types";

export interface IUseListComponent<T> {
  components: Record<IVariant, {
    [component: string]: T
  }>
}

export const useListComponent = <T extends ISchemaCore>(props: IUseListComponent<T>) => {
  const listVariant = Object.keys(props.components) as IVariant[];
  const useVariant = useState<IVariant>(listVariant[0]);

  const useSearch = useState<string>("");
  const [variant] = useVariant;
  const [search, setSearch] = useSearch;
  const [listComponent, setListComponent] = useState<T[]>([]);

  useEffect(() => {
    const schemas = Object.values(props.components[variant]);
    setListComponent(schemas);
    setSearch("");
  }, [variant]);

  const filteredListComponent = listComponent.filter((schema) => {
    if (!search) return true;

    return schema.component.toLowerCase().includes(search.toLowerCase());
  });

  return {
    filteredListComponent,
    listComponent,
    listVariant,
    useVariant,
    useSearch,
  };
};

export default useListComponent;