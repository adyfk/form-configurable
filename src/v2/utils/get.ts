/* eslint-disable no-nested-ternary */
import compact from "./compact";
import isNullOrUndefined from "./isNullOrUndefined";
import isObject from "./isObject";
import isUndefined from "./isUndefined";

export default <T>(obj: T, path: string, defaultValue?: unknown): any => {
  if (!path || !isObject(obj)) {
    return defaultValue;
  }

  const result = compact(path.split(/[,[\].]+?/)).reduce(
    // eslint-disable-next-line no-shadow
    (result, key) => (isNullOrUndefined(result) ? result : result[key as keyof {}]),
    obj,
  );

  return isUndefined(result) || result === obj
    ? isUndefined(obj[path as keyof T])
      ? defaultValue
      : obj[path as keyof T]
    : result;
};
