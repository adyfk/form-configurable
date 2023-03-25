/* eslint-disable no-use-before-define */
import {
  ExpressionThunk,
  ExpressionThunkArray,
  ExpressionValue,
  ExpressionValueArray,
  isExpressionArgumentsArray,
} from "./expression";

import {
  array,
  char,
  evalArray,
  evalBool,
  evalString,
  iterable,
  num,
  obj,
  string,
  date,
  callbackShouldAThunk,
} from "./formula-utils";

type CallbackFn = (..._args: ExpressionThunk[]) => ExpressionValue;

interface prefixOpsFormula {
  [op: string]: CallbackFn
}

interface InfixOpsFormula {
  [op: string]: CallbackFn;
}

export function call(name: string): (..._args: ExpressionThunkArray) => ExpressionValue {
  const upperName = name.toUpperCase();
  if (prefixOperator.hasOwnProperty(upperName)) {
    return (...args) => {
      args.isExpressionArgumentsArray = true;
      return prefixOperator[upperName](() => args);
    };
  } if (infixOperator.hasOwnProperty(upperName)) {
    return (...args) => infixOperator[upperName](args[0], args[1]);
  }
  throw new Error(`Unknown function: ${name}`);
}

const prefixOperatorCustom: prefixOpsFormula = {
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

export const infixOperator: InfixOpsFormula = {
  "+": (a, b) => num(a()) + num(b()),
  "-": (a, b) => num(a()) - num(b()),
  "*": (a, b) => num(a()) * num(b()),
  "/": (a, b) => num(a()) / num(b()),
  ",": (a, b) => {
    const aVal = a();
    const aArr: ExpressionValueArray = isExpressionArgumentsArray(aVal)
      ? aVal
      : [() => aVal];
    const args: ExpressionValueArray = aArr.concat([b]);
    args.isExpressionArgumentsArray = true;
    return args as ExpressionValueArray;
  },
  "%": (a, b) => num(a()) % num(b()),
  "=": (a, b) => a() === b(),
  "!=": (a, b) => a() !== b(),
  "<>": (a, b) => a() !== b(),
  "~=": (a, b) => Math.abs(num(a()) - num(b())) < Number.EPSILON,
  ">": (a, b) => a() > b(),
  "<": (a, b) => a() < b(),
  ">=": (a, b) => a() >= b(),
  "<=": (a, b) => a() <= b(),
  AND: (a, b) => a() && b(),
  OR: (a, b) => a() || b(),
  "^": (a, b) => num(a()) ** num(b()),
};

export const prefixOperator: prefixOpsFormula = {
  ...prefixOperatorCustom,
  NEG: (arg) => -num(arg()),
  ADD: (a, b) => num(a()) + num(b()),
  SUB: (a, b) => num(a()) - num(b()),
  MUL: (a, b) => num(a()) * num(b()),
  DIV: (a, b) => num(a()) / num(b()),
  MOD: (a, b) => num(a()) % num(b()),
  NOT: (arg) => !arg(),
  "!": (arg) => !arg(),
  CEIL: (arg) => Math.ceil(num(arg())),
  FLOOR: (arg) => Math.floor(num(arg())),
  ROUND: (arg) => Math.round(num(arg())),
  IF: (arg1, arg2, arg3) => {
    const condition = arg1;
    const thenStatement = arg2;
    const elseStatement = arg3;

    if (condition()) {
      return thenStatement();
    }
    return elseStatement();
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
  CHAR: (arg) => String.fromCharCode(num(arg())),
  CODE: (arg) => char(arg()).charCodeAt(0),
  // array
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
  INDEX: (arg1, arg2) => iterable(arg1())[num(arg2())],
  LENGTH: (arg) => iterable(arg()).length,
  JOIN: (arg1, arg2) => evalArray(arg2()).join(string(arg1())),
  STRING: (arg) => evalArray(arg()).join(""),
  SPLIT: (arg1, arg2) => string(arg2()).split(string(arg1())),
  CHARARRAY: (arg) => {
    const str = string(arg());
    return str.split("");
  },
  ARRAY: (arg) => {
    const val = arg();
    return isExpressionArgumentsArray(val) ? val.slice() : [val];
  },
  ISNAN: (arg) => Number.isNaN(num(arg())),
  MAP: (arg1, arg2) => {
    const func = arg1();
    const arr = evalArray(arg2());
    return arr.map((val) => {
      if (callbackShouldAThunk(func)) {
        return () => func(val);
      }
      return call(string(func))(() => val);
    });
  },
  REDUCE: (arg1, arg2, arg3) => {
    const func = arg1();
    const start = arg2();
    const arr = evalArray(arg3());
    return arr.reduce((prev, curr) => {
      const args: ExpressionThunk[] = [() => prev, () => curr];
      if (callbackShouldAThunk(func)) {
        return func(...args);
      }
      return call(string(func))(...args);
    }, start);
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
  UPPER: (arg) => string(arg()).toUpperCase(),
  LOWER: (arg) => string(arg()).toLowerCase(),

  TAKE: (arg1, arg2) => {
    const n = num(arg1());
    const arr = evalArray(arg2());
    return arr.slice(0, n);
  },
  DROP: (arg1, arg2) => {
    const n = num(arg1());
    const arr = evalArray(arg2());
    return arr.slice(n);
  },
  SLICE: (arg1, arg2, arg3) => {
    const start = num(arg1());
    const limit = num(arg2());
    const arr = evalArray(arg3());
    return arr.slice(start, limit);
  },
  CONCAT: (arg1, arg2) => {
    const arr1 = array(arg1());
    const arr2 = array(arg2());
    return arr1.concat(arr2);
  },
  HEAD: (arg1) => {
    const arr = array(arg1());
    return arr[0];
  },
  TAIL: (arg1) => {
    const arr = array(arg1());
    return arr.slice(1);
  },
  LAST: (arg1) => {
    const arr = array(arg1());
    return arr[arr.length - 1];
  },
  CONS: (arg1, arg2) => {
    const head = arg1();
    const arr = array(arg2());
    return [head].concat(arr);
  },
  FILTER: (arg1, arg2) => {
    const func = arg1();
    const arr = evalArray(arg2());
    const result: ExpressionValueArray = [];
    arr.forEach((val) => {
      let isSatisfied;
      if (callbackShouldAThunk(func)) {
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
  TAKEWHILE: (arg1, arg2) => {
    const func = arg1();
    const arr = evalArray(arg2());

    const satisfaction = (val: ExpressionValue) => {
      let isSatisfied;
      if (callbackShouldAThunk(func)) {
        isSatisfied = evalBool(func(val));
      } else {
        isSatisfied = evalBool(call(string(func))(() => val));
      }

      return isSatisfied;
    };

    let i = 0;
    while (satisfaction(arr[i]) && i < arr.length) {
      i++;
    }

    return arr.slice(0, i);
  },
  DROPWHILE: (arg1, arg2) => {
    const func = arg1();
    const arr = evalArray(arg2());

    const satisfaction = (val: ExpressionValue) => {
      let isSatisfied;
      if (callbackShouldAThunk(func)) {
        isSatisfied = evalBool(func(val));
      } else {
        isSatisfied = evalBool(call(string(func))(() => val));
      }

      return isSatisfied;
    };

    let i = 0;
    while (satisfaction(arr[i]) && i < arr.length) {
      i++;
    }

    return arr.slice(i);
  },

  GET: (arg1, arg2) => {
    const key = string(arg1());
    const inputObj = obj(arg2());

    return inputObj[key];
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
  UNZIPDICT: (arg1) => {
    const arr = evalArray(arg1());
    const result: { [key: string]: ExpressionValue } = {};

    arr.forEach((item) => {
      const kvPair = array(item);
      if (kvPair.length !== 2) {
        throw new Error("UNZIPDICT: Expected sub-array of length 2");
      }

      const [key, value] = kvPair;

      try {
        result[evalString(key)] = value;
      } catch (err: any) {
        throw new Error(`UNZIPDICT keys; ${err.message}`);
      }
    });

    return result;
  },
  KEYS: (arg1) => {
    const inputObj = obj(arg1());
    return Object.keys(inputObj).sort();
  },
  VALUES: (arg1) => {
    const inputObj = obj(arg1());
    return Object.keys(inputObj).sort().map((key) => inputObj[key]);
  },
};
