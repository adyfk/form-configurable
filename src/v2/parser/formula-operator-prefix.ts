/* eslint-disable no-use-before-define */
import type {
  ExpressionValue,
  ExpressionArray,
} from "expressionparser/dist/ExpressionParser";
import {
  array,
  date,
  evalArray,
  evalBool,
  isArgumentsArray,
  iterable,
  num,
  obj,
  string,
} from "./formula-utils";
import { ExpressionThunk } from "./expression";
import { INFIX_OPS } from "./formula-operator-infix";

export interface FunctionOps {
  [op: string]: (..._args: ExpressionThunk[]) => ExpressionValue;
}

export const PREFIX_IS_CONDTION: FunctionOps = {
  IS_BOOLEAN: (arg) => {
    try {
      return typeof arg() === "boolean";
    } catch (error) {
      return false;
    }
  },
  IS_NUMBER: (arg) => {
    try {
      return !Number.isNaN(num(arg()));
    } catch (error) {
      return false;
    }
  },
  IS_STRING: (arg) => {
    try {
      return !!string(arg());
    } catch (error) {
      return false;
    }
  },
  IS_ARRAY: (arg) => {
    try {
      return !!array(arg());
    } catch (error) {
      return false;
    }
  },
  IS_DICT: (arg) => {
    try {
      return !!obj(arg());
    } catch (error) {
      return false;
    }
  },
  IS_DATE: (arg) => {
    try {
      return !!date(arg());
    } catch (error) {
      return false;
    }
  },
  IS_EMAIL: (arg) => {
    try {
      return !!string(arg()).match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
    } catch (error) {
      return false;
    }
  },
  IS_HTML_EMPTY: (arg) => {
    try {
      const value = string(arg());
      if (!value) return true;
      if (value === "<div></div>") return true;
      if (value === "<span></span>") return true;
      return false;
    } catch (error) {
      return false;
    }
  },
};

export const PREFIX_DATE: FunctionOps = {
  DATE_MIN: (date1, date2) => {
    try {
      const d1 = date(date1());
      const d2 = date(date2());

      return d1 > d2;
    } catch (error) {
      return false;
    }
  },
  DATE_MAX: (date1, date2) => {
    try {
      const d1 = date(date1());
      const d2 = date(date2());

      return d2 > d1;
    } catch (error) {
      return false;
    }
  },
};

export const PREFIX_STRING: FunctionOps = {
  REGEX: (arg1, arg2) => {
    const stringRegex = string(arg1());
    const value = string(arg2());
    return new RegExp(stringRegex).test(value);
  },
  REGEX_FLAG: (arg1, arg2, arg3) => {
    const stringRegex = string(arg1());
    const flag = string(arg2());
    const value = string(arg3());
    return new RegExp(stringRegex, flag).test(value);
  },
  UPPER: (arg) => string(arg()).toUpperCase(),
  LOWER: (arg) => string(arg()).toLowerCase(),
};

export const PREFIX_NUMBER: FunctionOps = {
  NEG: (arg) => -num(arg()),
  ABS: (arg) => Math.abs(num(arg())),
  CEIL: (arg) => Math.ceil(num(arg())),
  FLOOR: (arg) => Math.floor(num(arg())),
  ROUND: (arg) => Math.round(num(arg())),
  MOD: (a, b) => num(a()) % num(b()),
  ADD: (a, b) => num(a()) + num(b()),
  SUB: (a, b) => num(a()) - num(b()),
  MUL: (a, b) => num(a()) * num(b()),
  DIV: (a, b) => num(a()) / num(b()),
};

export const PREFIX_BOOLEAN: FunctionOps = {
  "!": (arg) => !arg(),
};

export const PREFIX_ARRAY: FunctionOps = {
  INCLUDES: (arg1, arg2) => {
    const item = arg1();
    const arr = evalArray(arg2());
    return arr?.includes(item) || false;
  },
  AVERAGE: (arg) => {
    const arr = evalArray(arg());

    const sum = arr.reduce(
      (prev: number, curr): number => prev + num(curr),
      0,
    );
    return num(sum) / arr.length;
  },
  SUM: (arg) => evalArray(arg(), num).reduce((prev: number, curr) => prev + num(curr), 0),
  MIN: (arg) => evalArray(arg()).reduce(
    (prev: number, curr) => Math.min(prev, num(curr)),
    Number.POSITIVE_INFINITY,
  ),
  MAX: (arg) => evalArray(arg()).reduce(
    (prev: number, curr) => Math.max(prev, num(curr)),
    Number.NEGATIVE_INFINITY,
  ),
  SORT: (arg) => {
    const arr = array(arg()).slice();
    arr.sort();
    return arr;
  },
  REVERSE: (arg) => {
    const arr = array(arg()).slice();
    arr.reverse();
    return arr;
  },
  INDEX: (arg1, arg2) => iterable(arg2())[num(arg1())],
  LENGTH: (arg) => iterable(arg())?.length || 0,
  JOIN: (arg1, arg2) => evalArray(arg2()).join(string(arg1())),
  SPLIT: (arg1, arg2) => string(arg2()).split(string(arg1())),
  CHAR_ARRAY: (arg) => {
    const str = string(arg());
    return str.split("");
  },
  ARRAY: (arg) => {
    const val = arg();
    return isArgumentsArray(val) ? val.slice() : [val];
  },
  MAP: (arg1, arg2) => {
    const func = arg1();
    const arr = evalArray(arg2());
    return arr?.map((val) => {
      if (typeof func === "function") {
        return () => func(val);
      }
      return call(string(func))(() => val);
    }) || [];
  },
  MAP_ITEM: (arg1, arg2) => {
    const item = string(arg1());
    const arr = evalArray(arg2());
    return arr?.map((val: any) => val[item]) || [];
  },
  EVERY: (arg1, arg2) => {
    const varg1 = arg1();
    const arr = evalArray(arg2());
    return arr?.every((item) => item === varg1) || false;
  },
  EVERY_IS: (arg1, arg2) => {
    const func = arg1();
    const arr = evalArray(arg2());
    return arr?.every((item) => {
      const args: ExpressionArray<ExpressionThunk> = [() => item];
      return call(string(func))(...args);
    }) || false;
  },
  EVERY_INFIX: (arg1, arg2, arg3) => {
    const func = arg1();
    const value = arg2();
    const arr = evalArray(arg3());
    return arr?.every((item) => {
      const args: ExpressionArray<ExpressionThunk> = [
        () => value,
        () => item,
      ];
      if (typeof func === "function") {
        return func(...args);
      }
      return call(string(func))(...args);
    }) || false;
  },
  REDUCE: (arg1, arg2, arg3) => {
    const func = arg1();
    const start = arg2();
    const arr = evalArray(arg3());
    return arr?.reduce((prev, curr) => {
      const args: ExpressionArray<ExpressionThunk> = [() => prev, () => curr];
      if (typeof func === "function") {
        return func(...args);
      }
      return call(string(func))(...args);
    }, start) || start;
  },
  RANGE: (arg1, arg2) => {
    const start = num(arg1());
    const limit = num(arg2());
    const result = [];
    for (let i = start; i < limit; i++) {
      result.push(i);
    }
    return result;
  },
  CONCAT: (arg1, arg2) => {
    const arr1 = array(arg1());
    const arr2 = array(arg2());
    return arr1.concat(arr2);
  },
  PUSH: (arg1, arg2) => {
    const tail = arg1();
    const arr = array(arg2());
    arr.push(tail);
    return arr;
  },
  FILTER: (arg1, arg2) => {
    const func = arg1();
    const arr = evalArray(arg2());
    const result: ExpressionArray<ExpressionValue> = [];
    arr.forEach((val) => {
      let isSatisfied;
      if (typeof func === "function") {
        isSatisfied = evalBool(func(val));
      } else {
        isSatisfied = evalBool(call(string(func))(() => val));
      }

      if (isSatisfied) {
        result.push(val);
      }
    });

    return result;
  },
};

export const PREFIX_OBJECT: FunctionOps = {
  GET: (arg1, arg2) => {
    const key = string(arg1());
    const inputObj = obj(arg2());

    return inputObj?.[key];
  },
  PUT: (arg1, arg2, arg3) => {
    const key = string(arg1());
    const value = arg2();
    const inputObj = obj(arg3());

    return { ...inputObj, [key]: value };
  },
  DICT: (arg1, arg2) => {
    const arr1 = evalArray(arg1());
    const arr2 = evalArray(arg2());
    const result: { [key: string]: ExpressionValue } = {};

    arr1.forEach((v1, i) => {
      const key = string(v1);
      result[key] = arr2[i];
    });

    return result;
  },
  KEYS: (arg1) => {
    const inputObj = obj(arg1());
    return Object.keys(inputObj || {});
  },
  VALUES: (arg1) => {
    const inputObj = obj(arg1());
    return Object.keys(inputObj || {})
      .map((key) => inputObj[key]);
  },
};

export const PREFIX_CONDITION: FunctionOps = {
  IF: (arg1, arg2, arg3) => {
    const condition = arg1;
    const thenStatement = arg2;
    const elseStatement = arg3;

    if (condition()) {
      return thenStatement();
    }
    return elseStatement();
  },
};

export const PREFIX_OPS: FunctionOps = {
  ...PREFIX_IS_CONDTION,
  ...PREFIX_DATE,
  ...PREFIX_STRING,
  ...PREFIX_NUMBER,
  ...PREFIX_BOOLEAN,
  ...PREFIX_ARRAY,
  ...PREFIX_CONDITION,
  ...PREFIX_OBJECT,
};

type Callable = (..._args: ExpressionArray<ExpressionThunk>) => ExpressionValue;

const call = (name: string): Callable => {
  const upperName = name.toUpperCase();
  if (PREFIX_OPS.hasOwnProperty(upperName)) {
    return (...args) => {
      args.isArgumentsArray = true;
      return PREFIX_OPS[upperName](() => args);
    };
  } if (INFIX_OPS.hasOwnProperty(upperName)) {
    return (...args) => INFIX_OPS[upperName](args[0], args[1]);
  }
  throw new Error(`Unknown function: ${name}`);
};