import { useDrag, useDrop } from "react-dnd";
import { useContext, useRef } from "react";
import { ISchemaCore } from "../types";
import { FormContext } from "../contexts";

export interface IUseWrapperManagement {
  schema: any;
  schemas: any[];
  form?: any;
}

export const useWrapperManagement = (props: IUseWrapperManagement) => {
  const { form: formContext } = useContext(FormContext);
  const { schema, schemas, form = formContext } = props;
  const containerRef = useRef<any>();
  const [{ isDragging }, draggableRef, preview] = useDrag(
    () => ({
      type: schema.variant,
      item: schema,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [schema],
  );

  const [, drop] = useDrop(
    () => ({
      accept: ["FIELD", "FIELD-ARRAY", "FIELD-OBJECT", "VIEW", "GROUP"],
      hover(item: ISchemaCore) {
        if (item.key === schema.key) return;

        const dragIndex = schemas.findIndex((config: ISchemaCore) => config.key === schema.key);
        const hoverIndex = schemas.findIndex((config: ISchemaCore) => config.key === item.key);

        if (dragIndex === -1 || hoverIndex === -1) {
          return;
        }

        [schemas[dragIndex], schemas[hoverIndex]] = [
          schemas[hoverIndex],
          schemas[dragIndex],
        ];

        form.reset({});
      },
    }),
    [schema],
  );

  drop(containerRef);
  preview(containerRef);

  const updateSchema = (updatedSchema: any) => {
    const indexFound = schemas.findIndex(({ key }) => key === schema.key);
    if (indexFound >= 0) {
      schemas.splice(indexFound, 1, updatedSchema);
      form.reset({});
    }
  };

  const deleteSchema = () => {
    const indexFound = schemas.findIndex(({ key }) => key === schema.key);
    if (indexFound >= 0) {
      schemas.splice(indexFound, 1);
      form.reset({});
    }
  };

  return {
    containerRef,
    draggableRef,
    updateSchema,
    deleteSchema,
    isDragging,
  };
};

export default useWrapperManagement;