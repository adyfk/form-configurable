/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */

export type ValuePrimitive = number | boolean | string;
export type Delegate = (...args: (ExpressionValue | ExpressionThunk)[]) => ExpressionValue;
export type ExpressionFunction = Delegate;
export type ExpressionValue =
  | ValuePrimitive
  | ArgumentsArray
  | ExpressionArray<ExpressionValue>
  | { [key: string]: ExpressionValue }
  | ExpressionThunk
  | ExpressionFunction;
export type ExpressionThunk = () => ExpressionValue;
export type TermDelegate = (term: string) => ExpressionValue;
export type TermType = "number" | "boolean" | "string" | "function" | "array" | "object" | "unknown";
export type TermTyper = (term: string) => TermType;

type Infixer<T> = (token: string, lhs: T, rhs: T) => T;
type Prefixer<T> = (token: string, rhs: T) => T;
type Terminator<T> = (token: string, terms?: Record<string, ExpressionValue>) => T;

export type PrefixOp = (expr: ExpressionThunk) => ExpressionValue;

export interface PrefixOps {
  [op: string]: PrefixOp;
}

export type InfixOp = (
  a: ExpressionThunk,
  b: ExpressionThunk
) => ExpressionValue;

export interface InfixOps {
  [op: string]: InfixOp;
}

export interface Description {
  op: string;
  fix: "infix" | "prefix" | "surround";
  sig: string[];
  text: string;
}
const isInArray = <T>(array: T[], value: T) => {
  let i; let
    len;
  for (i = 0, len = array.length; i !== len; ++i) {
    if (array[i] === value) {
      return true;
    }
  }
  return false;
};

const mapValues = <A, B>(mapper: (val: A) => B) => (obj: {
  [key: string]: A;
}): { [key: string]: B } => {
  const result: { [key: string]: B } = {};
  Object.keys(obj).forEach((key) => {
    result[key] = mapper(obj[key]);
  });

  return result;
};

const convertKeys = <T>(converter: (key: string) => string) => (obj: {
  [key: string]: T;
}) => {
  const newKeys = Object.keys(obj)
    .map((key) => (obj.hasOwnProperty(key) ? [key, converter(key)] : null))
    .filter((val) => val != null);

  newKeys.forEach((keys) => {
    const [oldKey, newKey] = keys as string[];
    if (oldKey !== newKey) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
  });

  return obj;
};

export interface ExpressionArray<T> extends Array<T> {
  isArgumentsArray?: boolean;
}

export interface ArgumentsArray extends ExpressionArray<ExpressionThunk> {
  isArgumentsArray: true;
}

export const isArgumentsArray = (
  args: ExpressionValue,
): args is ArgumentsArray => Array.isArray(args) && !!args.isArgumentsArray;

const thunkEvaluator = (val: ExpressionValue) => evaluate(val);
const objEvaluator = mapValues<ExpressionValue, ExpressionValue>(
  thunkEvaluator,
);

const evaluate = (
  thunkExpression: ExpressionThunk | ExpressionValue,
): ExpressionValue => {
  if (typeof thunkExpression === "function" && thunkExpression.length === 0) {
    return evaluate(thunkExpression());
  } if (isArgumentsArray(thunkExpression)) {
    return thunkExpression.map((val) => evaluate(val()));
  } if (Array.isArray(thunkExpression)) {
    return thunkExpression.map(thunkEvaluator);
  } if (typeof thunkExpression === "object") {
    return objEvaluator(thunkExpression);
  }
  return thunkExpression;
};

const thunk = (delegate: Delegate, ...args: ExpressionValue[]) => () => delegate(...args);

export interface ExpressionParserOptions {
  AMBIGUOUS: {
    [op: string]: string;
  };
  PREFIX_OPS: PrefixOps;
  INFIX_OPS: InfixOps;
  ESCAPE_CHAR: string;
  LITERAL_OPEN: string;
  LITERAL_CLOSE: string;
  GROUP_OPEN: string;
  GROUP_CLOSE: string;
  SYMBOLS: string[];
  PRECEDENCE: string[][];
  SEPARATOR: string;
  termDelegate: TermDelegate;
  termTyper?: TermTyper;
  SURROUNDING?: {
    [token: string]: {
      OPEN: string;
      CLOSE: string;
    };
  };

  isCaseInsensitive?: boolean;
  descriptions?: Description[];
}

class ExpressionParser {
  options: ExpressionParserOptions;

  surroundingOpen: {
    [token: string]: boolean;
  };

  surroundingClose: {
    [token: string]: {
      OPEN: string;
      ALIAS: string;
    };
  };

  symbols: {
    [token: string]: string;
  };

  LIT_CLOSE_REGEX?: RegExp;

  LIT_OPEN_REGEX?: RegExp;

  constructor(options: ExpressionParserOptions) {
    this.options = options;
    this.surroundingOpen = {};
    this.surroundingClose = {};

    if (this.options.SURROUNDING) {
      Object.keys(this.options.SURROUNDING).forEach((key) => {
        const item = this.options.SURROUNDING![key];

        let open = item.OPEN;
        let close = item.CLOSE;
        if (this.options.isCaseInsensitive) {
          key = key.toUpperCase();
          open = open.toUpperCase();
          close = close.toUpperCase();
        }

        this.surroundingOpen[open] = true;
        this.surroundingClose[close] = {
          OPEN: open,
          ALIAS: key,
        };
      });
    }

    if (this.options.isCaseInsensitive) {
      // convert all terms to uppercase
      const upperCaser = (key: string) => key.toUpperCase();
      const upperCaseKeys = convertKeys(upperCaser);
      const upperCaseVals = mapValues(upperCaser);
      upperCaseKeys(this.options.INFIX_OPS);
      upperCaseKeys(this.options.PREFIX_OPS);
      upperCaseKeys(this.options.AMBIGUOUS);
      upperCaseVals(this.options.AMBIGUOUS);
      this.options.PRECEDENCE = this.options.PRECEDENCE.map((arr) => arr.map((val) => val.toUpperCase()));
    }

    if (this.options.LITERAL_OPEN) {
      this.LIT_CLOSE_REGEX = new RegExp(`${this.options.LITERAL_OPEN}$`);
    }

    if (this.options.LITERAL_CLOSE) {
      this.LIT_OPEN_REGEX = new RegExp(`^${this.options.LITERAL_CLOSE}`);
    }

    this.symbols = {};
    this.options.SYMBOLS.forEach((symbol) => {
      this.symbols[symbol] = symbol;
    });
  }

  resolveCase(key: string) {
    return this.options.isCaseInsensitive ? key.toUpperCase() : key;
  }

  resolveAmbiguity(token: string) {
    return this.options.AMBIGUOUS[this.resolveCase(token)];
  }

  isSymbol(char: string) {
    return this.symbols[char] === char;
  }

  getPrefixOp(op: string) {
    if (this.options.termTyper && this.options.termTyper(op) === "function") {
      const termValue = this.options.termDelegate(op);

      if (typeof termValue !== "function") {
        throw new Error(`${op} is not a function.`);
      }
      const result: (...args: any) => ExpressionValue = termValue;

      return (argsThunk: ExpressionThunk | ExpressionValue) => {
        const args = evaluate(argsThunk);
        if (!Array.isArray(args)) {
          return () => result(args);
        }
        return () => result(...args);
      };
    }
    return this.options.PREFIX_OPS[this.resolveCase(op)];
  }

  getInfixOp(op: string) {
    return this.options.INFIX_OPS[this.resolveCase(op)];
  }

  getPrecedence(op: string) {
    let i; let len;

    if (this.options.termTyper && this.options.termTyper(op) === "function") {
      return 0;
    }

    const casedOp = this.resolveCase(op);

    for (i = 0, len = this.options.PRECEDENCE.length; i !== len; ++i) {
      if (isInArray(this.options.PRECEDENCE[i], casedOp)) {
        return i;
      }
    }
    return i;
  }

  tokenize(expression: string) {
    const EOF = 0;
    const tokens = [];
    let token = "";

    const state = {
      startedWithSep: true,
      scanningLiteral: false,
      scanningSymbols: false,
      escaping: false,
    };

    const endWord = (endedWithSep: boolean) => {
      if (token !== "") {
        const disambiguated = this.resolveAmbiguity(token);
        if (disambiguated && state.startedWithSep && !endedWithSep) {
          tokens.push(disambiguated);
        } else {
          tokens.push(token);
        }
        token = "";
        state.startedWithSep = false;
      }
    };

    const chars = expression.split("");
    let currChar: string | typeof EOF;

    const handleGrouping = (currChar: string) => {
      endWord(currChar === this.options.GROUP_CLOSE);
      state.startedWithSep = currChar === this.options.GROUP_OPEN;
      tokens.push(currChar);
    };

    const handleSurrounding = (currChar: string) => {
      endWord(currChar in this.surroundingClose);
      state.startedWithSep = currChar in this.surroundingOpen;
      tokens.push(currChar);
    };

    const isSwitchingSymbol = (currChar: string) => (
      (this.isSymbol(currChar) && !state.scanningSymbols)
      || (!this.isSymbol(currChar) && state.scanningSymbols)
    );

    for (let i = 0, len = chars.length; i <= len; ++i) {
      currChar = i === len ? EOF : chars[i];

      if (currChar === this.options.ESCAPE_CHAR && !state.escaping) {
        state.escaping = true;
        continue;
      }

      if (state.escaping) {
        token += currChar;
      } else if (
        currChar === this.options.LITERAL_OPEN
        && !state.scanningLiteral
      ) {
        state.scanningLiteral = true;
        endWord(false);
      } else if (currChar === this.options.LITERAL_CLOSE) {
        state.scanningLiteral = false;
        tokens.push(
          this.options.LITERAL_OPEN + token + this.options.LITERAL_CLOSE,
        );
        token = "";
      } else if (currChar === EOF) {
        endWord(true);
      } else if (state.scanningLiteral) {
        token += currChar;
      } else if (currChar === this.options.SEPARATOR) {
        endWord(true);
        state.startedWithSep = true;
      } else if (
        currChar === this.options.GROUP_OPEN
        || currChar === this.options.GROUP_CLOSE
      ) {
        handleGrouping(currChar);
      } else if (
        currChar in this.surroundingOpen
        || currChar in this.surroundingClose
      ) {
        handleSurrounding(currChar);
      } else if (isSwitchingSymbol(currChar)) {
        endWord(false);
        token += currChar;
        state.scanningSymbols = !state.scanningSymbols;
      } else {
        token += currChar;
      }

      state.escaping = false;
    }

    return tokens;
  }

  tokensToRpn(tokens: string[]) {
    const output: string[] = [];
    const stack: string[] = [];
    const grouping: string[] = [];

    const isInfixOrPrefix = (token: string) => typeof this.getInfixOp(token) !== "undefined"
      || typeof this.getPrefixOp(token) !== "undefined";

    const handleOperator = (token: string) => {
      const tokenPrecedence = this.getPrecedence(token);
      let lastInStack = stack[stack.length - 1];

      while (
        lastInStack
        && ((!!this.getPrefixOp(lastInStack)
          && this.getPrecedence(lastInStack) < tokenPrecedence)
          || (!!this.getInfixOp(lastInStack)
            && this.getPrecedence(lastInStack) <= tokenPrecedence))
      ) {
        output.push(stack.pop()!);
        lastInStack = stack[stack.length - 1];
      }
      stack.push(token);
    };

    const handleGrouping = (token: string, openToken: string) => {
      if (grouping.pop() !== openToken) {
        throw new Error(`Mismatched Grouping (unexpected closing "${token}")`);
      }

      let poppedToken = stack.pop();
      while (poppedToken !== openToken && typeof poppedToken !== "undefined") {
        output.push(poppedToken);
        poppedToken = stack.pop();
      }

      if (typeof poppedToken === "undefined") {
        throw new Error("Mismatched Grouping");
      }
    };

    for (const token of tokens) {
      if (isInfixOrPrefix(token)) {
        handleOperator(token);
      } else if (this.surroundingOpen[token]) {
        stack.push(token);
        grouping.push(token);
      } else if (this.surroundingClose[token]) {
        const surroundingToken = this.surroundingClose[token];
        handleGrouping(token, surroundingToken.OPEN);
        stack.push(surroundingToken.ALIAS);
      } else if (token === this.options.GROUP_OPEN) {
        stack.push(token);
        grouping.push(token);
      } else if (token === this.options.GROUP_CLOSE) {
        handleGrouping(token, this.options.GROUP_OPEN);
      } else {
        output.push(token);
      }
    }

    while (stack.length > 0) {
      const token = stack.pop()!;
      const surroundingToken = this.surroundingClose[token!];

      if (surroundingToken) {
        handleGrouping(token!, surroundingToken.OPEN);
      } else if (token === this.options.GROUP_CLOSE) {
        handleGrouping(token!, this.options.GROUP_OPEN);
      } else {
        output.push(token);
      }
    }

    if (grouping.length !== 0) {
      throw new Error(`Mismatched Grouping (unexpected "${grouping.pop()}")`);
    }

    return output;
  }

  evaluateRpn<T>(
    stack: string[],
    infixer: Infixer<T>,
    prefixer: Prefixer<T>,
    terminator: Terminator<T>,
    terms?: Record<string, ExpressionValue>,
  ): T {
    const token = stack.pop();

    if (typeof token === "undefined") {
      throw new Error("Parse Error: unexpected EOF");
    }

    const infixDelegate = !!this.getInfixOp(token);
    const prefixDelegate = !!this.getPrefixOp(token);

    const isInfix = infixDelegate && stack.length > 1;
    const isPrefix = prefixDelegate && stack.length > 0;

    if (isInfix) {
      const rhs = this.evaluateRpn<T>(stack, infixer, prefixer, terminator, terms);
      const lhs = this.evaluateRpn<T>(stack, infixer, prefixer, terminator, terms);
      return infixer(token, lhs, rhs);
    } if (isPrefix) {
      const rhs = this.evaluateRpn<T>(stack, infixer, prefixer, terminator, terms);
      return prefixer(token, rhs);
    }
    return terminator(token, terms);
  }

  rpnToExpression(stack: string[]): string {
    const infixExpr: Infixer<string> = (term, lhs, rhs) => `${this.options.GROUP_OPEN}${lhs}${this.options.SEPARATOR}${term}${this.options.SEPARATOR}${rhs}${this.options.GROUP_CLOSE}`;

    const prefixExpr: Prefixer<string> = (term, rhs) => `${this.isSymbol(term) ? term : term + this.options.SEPARATOR}${this.options.GROUP_OPEN}${rhs}${this.options.GROUP_CLOSE}`;

    const termExpr: Terminator<string> = (term) => term;

    return this.evaluateRpn(stack, infixExpr, prefixExpr, termExpr);
  }

  rpnToTokens(stack: string[]): string[] {
    const infixExpr: Infixer<string[]> = (term, lhs, rhs) => [
      this.options.GROUP_OPEN,
      ...lhs,
      term,
      ...rhs,
      this.options.GROUP_CLOSE,
    ];

    const prefixExpr: Prefixer<string[]> = (term, rhs) => [
      term,
      this.options.GROUP_OPEN,
      ...rhs,
      this.options.GROUP_CLOSE,
    ];

    const termExpr: Terminator<string[]> = (term) => [term];

    return this.evaluateRpn(stack, infixExpr, prefixExpr, termExpr);
  }

  rpnToThunk(stack: string[], terms?: Record<string, ExpressionValue>): ExpressionThunk {
    const infixExpr: Infixer<ExpressionThunk> = (term, lhs, rhs) => thunk(this.getInfixOp(term) as Delegate, lhs, rhs);

    const prefixExpr: Prefixer<ExpressionThunk> = (term, rhs) => thunk(this.getPrefixOp(term) as Delegate, rhs);

    const termExpr: Terminator<ExpressionThunk> = (term, terms) => {
      if (this.options.LITERAL_OPEN && term.startsWith(this.options.LITERAL_OPEN)) {
        // Literal string
        return () => term
          .replace(this.LIT_OPEN_REGEX!, "")
          .replace(this.LIT_CLOSE_REGEX!, "");
      }
      return terms && term in terms
        ? () => terms[term]
        : thunk(this.options.termDelegate as Delegate, term);
    };

    return this.evaluateRpn(stack, infixExpr, prefixExpr, termExpr, terms);
  }

  rpnToValue(stack: string[], terms?: Record<string, ExpressionValue>): ExpressionValue {
    return evaluate(this.rpnToThunk(stack, terms));
  }

  thunkToValue(thunk: ExpressionThunk) {
    return evaluate(thunk);
  }

  expressionToRpn(expression: string) {
    return this.tokensToRpn(this.tokenize(expression));
  }

  expressionToThunk(expression: string, terms?: Record<string, ExpressionValue>) {
    return this.rpnToThunk(this.expressionToRpn(expression), terms);
  }

  expressionToValue(expression: string, terms?: Record<string, ExpressionValue>) {
    return this.rpnToValue(this.expressionToRpn(expression), terms);
  }

  tokensToValue(tokens: string[]) {
    return this.rpnToValue(this.tokensToRpn(tokens));
  }

  tokensToThunk(tokens: string[]) {
    return this.rpnToThunk(this.tokensToRpn(tokens));
  }
}

export default ExpressionParser;
