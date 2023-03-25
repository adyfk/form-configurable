/* eslint-disable no-nested-ternary */
import isKey from "./isKey";
import isObject from "./isObject";
import stringToPath from "./stringToPath";

export default function set(
  object: Record<string, any>,
  path: string,
  value?: unknown,
) {
  let index = -1;
  const tempPath = isKey(path) ? [path] : stringToPath(path);
  const { length } = tempPath;
  const lastIndex = length - 1;

  while (++index < length) {
    const key = tempPath[index];
    let newValue = value;

    if (index !== lastIndex) {
      const objValue = object[key];
      newValue = isObject(objValue) || Array.isArray(objValue)
        ? objValue
        : !Number.isNaN(+tempPath[index + 1])
          ? []
          : {};
    }
    object[key] = newValue;
    object = object[key];
  }
  return object;
}
