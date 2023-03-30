import { useRef, useState } from "react";

export const useDialogAddComponent = ({ action }: { action: any }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const schemasRef = useRef<any[]>([]);

  const onOpenDialog = (schemas: any) => {
    schemasRef.current = schemas;
    setOpenDialog(true);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
  };

  const onAdd = (schema: any) => {
    schemasRef.current.push(schema);
    action.form.reset({});
  };

  return {
    openDialog,
    onOpenDialog,
    onCloseDialog,
    onAdd,
  };
};