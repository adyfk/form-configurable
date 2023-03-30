import { useRef, useState } from "react";
import useForm from "./useForm";
import { ICreateFormProps } from "../logic/createForm";

export const useManagement = <TSchema>(props: ICreateFormProps<TSchema>) => {
  const schemas = useRef<any[]>([]);
  const action = useForm(props);
  const [openDialogAddComponent, setOpenDialog] = useState(false);

  const onOpenDialogAddComponent = (schemas: any) => {
    schemas.current = schemas;
    setOpenDialog(true);
  };

  const onCloseDialogAddComponent = () => {
    setOpenDialog(false);
  };

  const onAddComponent = (schema: any) => {
    schemas.current.push(schema);
    action.form.reset({});
  };

  return {
    action,
    openDialogAddComponent,
    onOpenDialogAddComponent,
    onCloseDialogAddComponent,
    onAddComponent,
  };
};