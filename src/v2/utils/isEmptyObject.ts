import { EmptyObject } from "../types/utils";
import isObject from "./isObject";

export default (value: unknown): value is EmptyObject => isObject(value) && !Object.keys(value).length;
