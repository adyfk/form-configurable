/* eslint-disable indent */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
import type {
  Delegate,
  ExpressionThunk,
  TermDelegate,
  ExpressionValue,
  ExpressionParserOptions,
  TermTyper,
  TermType,
} from "expressionparser/dist/ExpressionParser";
import {
  isArgumentsArray,
} from "./formula-utils";
import { INFIX_OPS } from "./formula-operator-infix";
import { createPrefixOperator } from "./formula-operator-prefix";

export interface FunctionOps {
  // eslint-disable-next-line no-unused-vars
  [op: string]: (...args: ExpressionThunk[]) => ExpressionValue;
}

const unpackArgs = (func: Delegate, key: string) => (expr: ExpressionThunk) => {
  const result = expr();

  if (!isArgumentsArray(result)) {
    if (func.length > 1) {
      throw new Error(
        `Too few arguments. Expected ${func.length}, found 1 (${JSON.stringify(
          result,
        )})`,
      );
    }
    return func(() => result);
  } if (result.length === func.length || func.length === 0) {
    // eslint-disable-next-line prefer-spread
    return func.apply(null, result);
  }
  // eslint-disable-next-line no-console
  console.log("key =", key);
  // eslint-disable-next-line no-console
  console.log(`fn: unpackArgs (result.length) = ${result.length}`, { result });
  // eslint-disable-next-line no-console
  console.log(`fn: unpackArgs (f.length) = ${func.length}`, { func });
  // eslint-disable-next-line no-console
  console.log("fn: unpackArgs (f.toString) = ", func.toString());
  // eslint-disable-next-line no-console
  console.log("fn: unpackArgs (expr)", { expr });

  throw new Error(`Incorrect number of arguments. Expected ${func.length}`);
};

// eslint-disable-next-line no-unused-vars
export const formula = function (
  termDelegate: TermDelegate,
  termTypeDelegate?: TermTyper,
): ExpressionParserOptions {
  const prefixOps = createPrefixOperator();
  const infixOps = INFIX_OPS;
  // Ensure arguments are unpacked accordingly
  // Except for the ARRAY constructor
  Object.keys(prefixOps).forEach((key) => {
    if (key !== "ARRAY") {
      prefixOps[key] = unpackArgs((prefixOps as any)[key], key);
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
