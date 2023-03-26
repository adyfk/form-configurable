/* eslint-disable indent */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
import type {
  Delegate,
  ExpressionThunk,
  TermDelegate,
  InfixOps,
  ExpressionValue,
  ExpressionArray,
  ExpressionParserOptions,
  TermTyper,
  TermType,
  ArgumentsArray,
} from "expressionparser/dist/ExpressionParser";

export interface FunctionOps {
  // eslint-disable-next-line no-unused-vars
  [op: string]: (...args: ExpressionThunk[]) => ExpressionValue;
}

export const isArgumentsArray = (
  args: ExpressionValue,
): args is ArgumentsArray => Array.isArray(args) && !!args.isArgumentsArray;

const unpackArgs = (f: Delegate) => (expr: ExpressionThunk) => {
  const result = expr();

  if (!isArgumentsArray(result)) {
    if (f.length > 1) {
      throw new Error(
        `Too few arguments. Expected ${f.length}, found 1 (${JSON.stringify(
          result,
        )})`,
      );
    }
    return f(() => result);
  } if (result.length === f.length || f.length === 0) {
    // eslint-disable-next-line prefer-spread
    return f.apply(null, result);
  }
  throw new Error(`Incorrect number of arguments. Expected ${f.length}`);
};

const num = (result: ExpressionValue) => {
  if (typeof result !== "number") {
    throw new Error(
      `Expected number, found: ${typeof result} ${JSON.stringify(result)}`,
    );
  }

  return result;
};

const array = (result: ExpressionValue) => {
  if (!Array.isArray(result)) {
    throw new Error(
      `Expected array, found: ${typeof result} ${JSON.stringify(result)}`,
    );
  }

  if (isArgumentsArray(result)) {
    throw new Error("Expected array, found: arguments");
  }

  return result;
};

const bool = (value: ExpressionValue) => {
  if (typeof value !== "boolean") {
    throw new Error(
      `Expected boolean, found: ${typeof value} ${JSON.stringify(value)}`,
    );
  }

  return value;
};

const evalBool = (value: ExpressionValue): boolean => {
  let result;

  while (typeof value === "function" && value.length === 0) {
    result = value();
  }

  if (!result) {
    result = value;
  }

  return bool(result);
};

const evalArray = (
  arr: ExpressionValue,
  // eslint-disable-next-line no-unused-vars
  typeCheck?: (value: ExpressionValue) => ExpressionValue,
) => array(arr).map((value) => {
  let result;
  if (typeof value === "function" && value.length === 0) {
    result = value();
  } else {
    result = value;
  }

  if (typeCheck) {
    try {
      result = typeCheck(result);
    } catch (err: any) {
      throw new Error(`In array; ${err.message}`);
    }
  }

  return result;
});

const obj = (obj: ExpressionValue) => {
  if (typeof obj !== "object" || obj === null) {
    throw new Error(
      `Expected object, found: ${typeof obj} ${JSON.stringify(obj)}`,
    );
  } else if (Array.isArray(obj)) {
    throw new Error("Expected object, found array");
  }

  return obj;
};

const iterable = (result: ExpressionValue) => {
  if (!Array.isArray(result) && typeof result !== "string") {
    throw new Error(
      `Expected array or string, found: ${typeof result} ${JSON.stringify(
        result,
      )}`,
    );
  }

  return result;
};

const string = (result: ExpressionValue) => {
  if (typeof result !== "string") {
    throw new Error(
      `Expected string, found: ${typeof result} ${JSON.stringify(result)}`,
    );
  }

  return result;
};

const char = (result: ExpressionValue) => {
  if (typeof result !== "string" || result.length !== 1) {
    throw new Error(
      `Expected char, found: ${typeof result} ${JSON.stringify(result)}`,
    );
  }

  return result;
};

const date = (result: ExpressionValue) => {
  if (`${result}` === "Invalid Date") {
    throw new Error(`Expected date, found: ${typeof result}`);
  }

  if (result instanceof Date) return result;

  if (!(typeof result === "string" || typeof result === "number")) {
    throw new Error(`Expected string or number, found: ${typeof result}`);
  }
  const parseToDate = new Date(result);

  if (`${parseToDate}` === "Invalid Date") {
    throw new Error(
      `Expected string or number date format, found: ${typeof result}`,
    );
  }

  return parseToDate;
};

const evalString = (value: ExpressionValue) => {
  let result;
  if (typeof value === "function" && value.length === 0) {
    result = value();
  } else {
    result = value;
  }

  return string(result);
};

// eslint-disable-next-line no-unused-vars
type Callable = (...args: ExpressionArray<ExpressionThunk>) => ExpressionValue;

export const formula = function (
  termDelegate: TermDelegate,
  termTypeDelegate?: TermTyper,
): ExpressionParserOptions {
  const call = (name: string): Callable => {
    const upperName = name.toUpperCase();
    if (prefixOps.hasOwnProperty(upperName)) {
      return (...args) => {
        args.isArgumentsArray = true;
        return prefixOps[upperName](() => args);
      };
    } if (infixOps.hasOwnProperty(upperName)) {
      return (...args) => infixOps[upperName](args[0], args[1]);
    }
    throw new Error(`Unknown function: ${name}`);
  };

  const infixOps: InfixOps = {
    "+": (a, b) => num(a()) + num(b()),
    "-": (a, b) => num(a()) - num(b()),
    "*": (a, b) => num(a()) * num(b()),
    "/": (a, b) => num(a()) / num(b()),
    ",": (a, b): ArgumentsArray => {
      const aVal = a();
      const aArr: ExpressionArray<ExpressionValue> = isArgumentsArray(aVal)
        ? aVal
        : [() => aVal];
      const args: ExpressionArray<ExpressionValue> = aArr.concat([b]);
      args.isArgumentsArray = true;
      return args as ArgumentsArray;
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

  const prefixOps: FunctionOps = {
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
    INCLUDES: (arg1, arg2) => {
      const item = arg1();
      const arr = evalArray(arg2());
      return arr.includes(item);
    },
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
    NEG: (arg) => -num(arg()),
    MOD: (a, b) => num(a()) % num(b()),
    NOT: (arg) => !arg(),
    "!": (arg) => !arg(),
    ADD: (a, b) => num(a()) + num(b()),
    SUB: (a, b) => num(a()) - num(b()),
    MUL: (a, b) => num(a()) * num(b()),
    DIV: (a, b) => num(a()) / num(b()),
    ABS: (arg) => Math.abs(num(arg())),
    CEIL: (arg) => Math.ceil(num(arg())),
    EXP: (arg) => Math.exp(num(arg())),
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
      return isArgumentsArray(val) ? val.slice() : [val];
    },
    MAP: (arg1, arg2) => {
      const func = arg1();
      const arr = evalArray(arg2());
      return arr.map((val) => {
        if (typeof func === "function") {
          return () => func(val);
        }
        return call(string(func))(() => val);
      });
    },
    MAP_ITEM: (arg1, arg2) => {
      const item = string(arg1());
      const arr = evalArray(arg2());
      return arr.map((val: any) => val[item]);
    },
    EVERY: (arg1, arg2) => {
      const varg1 = arg1();
      const arr = evalArray(arg2());
      return arr.every((item) => item === varg1);
    },
    EVERY_IS: (arg1, arg2) => {
      const func = arg1();
      const arr = evalArray(arg2());
      return arr.every((item) => {
        const args: ExpressionArray<ExpressionThunk> = [() => item];
        return call(string(func))(...args);
      });
    },
    EVERY_WHILE: (arg1, arg2, arg3) => {
      const func = arg1();
      const value = arg2();
      const arr = evalArray(arg3());
      return arr.every((item) => {
        const args: ExpressionArray<ExpressionThunk> = [
          () => value,
          () => item,
        ];
        if (typeof func === "function") {
          return func(...args);
        }
        return call(string(func))(...args);
      });
    },
    REDUCE: (arg1, arg2, arg3) => {
      const func = arg1();
      const start = arg2();
      const arr = evalArray(arg3());
      return arr.reduce((prev, curr) => {
        const args: ExpressionArray<ExpressionThunk> = [() => prev, () => curr];
        if (typeof func === "function") {
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

    ZIP: (arg1, arg2) => {
      const arr1 = evalArray(arg1());
      const arr2 = evalArray(arg2());

      if (arr1.length !== arr2.length) {
        throw new Error("ZIP: Arrays are of different lengths");
      } else {
        return arr1.map((v1, i) => [v1, arr2[i]]);
      }
    },
    UNZIP: (arg1) => {
      const inputArr = evalArray(arg1());
      const arr1 = inputArr.map((item) => array(item)[0]);
      const arr2 = inputArr.map((item) => array(item)[1]);
      return [arr1, arr2];
    },
    CONCAT: (arg1, arg2) => {
      const arr1 = array(arg1());
      const arr2 = array(arg2());
      return arr1.concat(arr2);
    },
    CONS: (arg1, arg2) => {
      const head = arg1();
      const arr = array(arg2());
      return [head].concat(arr);
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
    TAKEWHILE: (arg1, arg2) => {
      const func = arg1();
      const arr = evalArray(arg2());

      const satisfaction = (val: ExpressionValue) => {
        let isSatisfied;
        if (typeof func === "function") {
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
        if (typeof func === "function") {
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
      return Object.keys(inputObj)
        .sort()
        .map((key) => inputObj[key]);
    },
  };

  // Ensure arguments are unpacked accordingly
  // Except for the ARRAY constructor
  Object.keys(prefixOps).forEach((key) => {
    if (key !== "ARRAY") {
      prefixOps[key] = unpackArgs((prefixOps as any)[key]);
    }
  });

  return {
    ESCAPE_CHAR: "\\",
    INFIX_OPS: infixOps,
    PREFIX_OPS: prefixOps,
    PRECEDENCE: [
      Object.keys(prefixOps),
      ["^"],
      ["*", "/", "%", "MOD"],
      ["+", "-"],
      ["<", ">", "<=", ">="],
      ["=", "!=", "<>", "~="],
      ["AND", "OR"],
      [","],
    ],
    LITERAL_OPEN: "\"",
    LITERAL_CLOSE: "\"",
    GROUP_OPEN: "(",
    GROUP_CLOSE: ")",
    SEPARATOR: " ",
    SYMBOLS: [
      "^",
      "*",
      "/",
      "%",
      "+",
      "-",
      "<",
      ">",
      "=",
      "!",
      ",",
      "\"",
      "(",
      ")",
      "[",
      "]",
      "~",
    ],
    AMBIGUOUS: {
      "-": "NEG",
    },
    SURROUNDING: {
      ARRAY: {
        OPEN: "[",
        CLOSE: "]",
      },
    },

    termDelegate(term: string) {
      const numVal = parseFloat(term);
      if (Number.isNaN(numVal)) {
        switch (term) {
          case "FALSE":
            return false;
          case "TRUE":
            return true;
          case "EMPTY":
            return [];
          case "EMPTYDICT":
            return {};
          case "INFINITY":
            return Number.POSITIVE_INFINITY;
          case "EPSILON":
            return Number.EPSILON;
          case "UNDEFINED":
            return undefined as any;
          default:
            return termDelegate(term);
        }
      } else {
        return numVal;
      }
    },

    termTyper(term: string): TermType {
      const numVal = parseFloat(term);

      if (Number.isNaN(numVal)) {
        switch (term) {
          case "FALSE":
            return "boolean";
          case "TRUE":
            return "boolean";
          case "EMPTY":
            return "array";
          case "INFINITY":
            return "number";
          case "EPSILON":
            return "number";
          default:
            return termTypeDelegate ? termTypeDelegate(term) : "unknown";
        }
      } else {
        return "number";
      }
    },

    isCaseInsensitive: true,
  };
};

export default formula;
