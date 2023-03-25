import { createContext } from "react";
import { ISchema } from "../types";
import useForm from "../hooks/useForm";

export const FormContext = createContext<ReturnType<(typeof useForm<ISchema>)>>({} as any);
