import { ExpressionParser } from "expressionparser";
import { formula } from "./formula";

export const createParser = (config = formula) => new ExpressionParser(config((val) => val));