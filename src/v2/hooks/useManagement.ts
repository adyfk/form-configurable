import useForm from "./useForm";
import { ICreateFormProps } from "../logic/createForm";

export const useManagement = <TSchema>(props: ICreateFormProps<TSchema>) => {
  const action = useForm(props);
  return {
    action,
  };
};

export default useManagement;