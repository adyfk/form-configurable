/* eslint-disable indent */
/* eslint-disable no-use-before-define */
import {
  ExpressionThunk,
  TermDelegate,
  ExpressionValue,
  isExpressionArgumentsArray,
  ExpressionParserOptions,
  TermTyper,
  TermType,
  InfixOps,
  PrefixOps,
  // ExpressionThunkFunction,
} from "./expression";
import { infixOperator, prefixOperator } from "./formula-operator";

type CallbackFn = (..._args: ExpressionThunk[]) => ExpressionValue;

const unpackArgs = (f: CallbackFn) => (expr: ExpressionThunk) => {
  const result = expr();

  if (!isExpressionArgumentsArray(result)) {
    if (f.length > 1) {
      throw new Error(`Too few arguments. Expected ${f.length}, found 1 (${JSON.stringify(result)})`);
    }
    return f(() => result);
  } if (result.length === f.length || f.length === 0) {
    return f(result as any);
  }
  throw new Error(`Incorrect number of arguments. Expected ${f.length}`);
};

// eslint-disable-next-line func-names
export const formula = (termDelegate: TermDelegate, termTypeDelegate?: TermTyper): ExpressionParserOptions => {
  // callable
  const prefixOps = { ...prefixOperator };
  const infixOps = { ...infixOperator };

  Object.keys(prefixOps).forEach((key) => {
    if (key !== "ARRAY") {
      prefixOps[key] = unpackArgs(prefixOps[key]);
    }
  });

  return {
    ESCAPE_CHAR: "\\",
    INFIX_OPS: infixOps as InfixOps,
    PREFIX_OPS: prefixOps as PrefixOps,
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
          case "PI":
            return Math.PI;
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
          case "SQRT2":
            return "number";
          case "FALSE":
            return "boolean";
          case "TRUE":
            return "boolean";
          case "EMPTY":
            return "array";
          case "INFINITY":
            return "number";
          default:
            return termTypeDelegate ? termTypeDelegate(term) : "unknown";
        }
      } else {
        return "number";
      }
    },
  };
};
