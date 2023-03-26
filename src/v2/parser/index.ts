import { parser } from "../../parser";
import { formula } from "./formula";

export const createParser = (_config = formula) => parser;