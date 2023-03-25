/* eslint-disable indent */
/* eslint-disable no-use-before-define */

// init value

// eslint-disable-next-line max-classes-per-file
export type ExpressionPrimitive = number | boolean | string;
export type ExpressionThunk = (..._args: ExpressionValue[]) => ExpressionValue;
export type ExpressionThunkArray = ExpressionThunk[] & { isExpressionArgumentsArray?: boolean; }
export type ExpressionValueArray = ExpressionValue[] & { isExpressionArgumentsArray?: boolean; }
export type ExpressionObject = { [key: string]: ExpressionValue }
export type ExpressionThunkFunction = (..._args: ExpressionThunk[]) => ExpressionValue

export type ExpressionValue =
  ExpressionPrimitive |
  ExpressionThunk |
  ExpressionThunkArray |
  ExpressionValueArray |
  ExpressionObject |
  ExpressionThunkFunction;

// ==================================================================================================

// term

export type TermDelegate = (_term: string) => ExpressionValue;
export type TermType = "number" | "boolean" | "string" | "function" | "array" | "object" | "unknown";
export type TermTyper = (_term: string) => TermType;

// ==================================================================================================

// expression options

export interface PrefixOps {
  [op: string]: ExpressionThunk;
}

export interface InfixOps {
  [op: string]: ExpressionThunk;
}

export interface Description {
  op: string;
  fix: "infix" | "prefix" | "surround";
  sig: string[];
  text: string;
}

// ==================================================================================================

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
  descriptions?: Description[];
}

type Infixer<T> = (_token: string, _lhs: T, _rhs: T) => T;
type Prefixer<T> = (_token: string, _rhs: T) => T;
type Terminator<T> = (_token: string, _terms?: Record<string, ExpressionValue>) => T;

export const isExpressionArgumentsArray = (args: ExpressionValue): args is ExpressionThunkArray => Array.isArray(args) && !!args.isExpressionArgumentsArray;

const thunkEvaluator = (val: ExpressionValue) => evaluate(val);
const mapValues = <A, B>(mapper: (_val: A) => B) => (obj: { [key: string]: A; }): { [key: string]: B } => {
  const result: { [key: string]: B } = {};

  Object.keys(obj).forEach((key) => {
    result[key] = mapper(obj[key]);
  });

  return result;
};
const objEvaluator = mapValues<ExpressionValue, ExpressionValue>(
  thunkEvaluator,
);

const evaluate = (
  thunkExpression: ExpressionThunk | ExpressionValue,
): ExpressionValue => {
  if (typeof thunkExpression === "function" && thunkExpression.length === 0) {
    return evaluate(thunkExpression());
  }

  if (isExpressionArgumentsArray(thunkExpression)) {
    return thunkExpression.map((val) => evaluate(val()));
  }

  if (Array.isArray(thunkExpression)) {
    return thunkExpression.map(thunkEvaluator);
  }

  if (typeof thunkExpression === "object") {
    return objEvaluator(thunkExpression);
  }
  return thunkExpression;
};

const thunk = (delegate: ExpressionThunk, ...args: ExpressionValue[]) => () => delegate(...args);

class ExpressionParser {
  options: ExpressionParserOptions = {} as ExpressionParserOptions;

  surroundingOpen: {
    [token: string]: boolean;
  } = {};

  surroundingClose: {
    [token: string]: {
      OPEN: string;
      ALIAS: string;
    };
  } = {};

  symbols: {
    [token: string]: string;
  } = {};

  // eslint-disable-next-line prefer-regex-literals
  LIT_CLOSE_REGEX: RegExp = new RegExp("\"$");

  // eslint-disable-next-line prefer-regex-literals
  LIT_OPEN_REGEX: RegExp = new RegExp("^\"$");

  constructor(options: ExpressionParserOptions) {
    this.options = options;
    this.surroundingOpen = {};
    this.surroundingClose = {};
    this.symbols = {};

    if (this.options.SURROUNDING) {
      Object.keys(this.options.SURROUNDING).forEach((key) => {
        const item = this.options!.SURROUNDING?.[key];

        const open = item!.OPEN;
        const close = item!.CLOSE;

        this.surroundingOpen[open] = true;
        this.surroundingClose[close] = {
          OPEN: open,
          ALIAS: key,
        };
      });
    }

    if (this.options.LITERAL_OPEN) {
      this.LIT_CLOSE_REGEX = new RegExp(`${this.options.LITERAL_OPEN}$`);
    }

    if (this.options.LITERAL_CLOSE) {
      this.LIT_OPEN_REGEX = new RegExp(`^${this.options.LITERAL_CLOSE}`);
    }

    this.options.SYMBOLS.forEach((symbol) => {
      this.symbols[symbol] = symbol;
    });
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
      const result: (..._args: any) => ExpressionValue = termValue;

      return (argsThunk: ExpressionThunk | ExpressionValue) => {
        const args = evaluate(argsThunk);
        if (!Array.isArray(args)) {
          return () => result(args);
        }
        return () => result(...args);
      };
    }
    return this.options.PREFIX_OPS[op];
  }

  getInfixOp(op: string) {
    return this.options.INFIX_OPS[op];
  }

  getPrecedence(op: string) {
    let i; let len;

    if (this.options.termTyper && this.options.termTyper(op) === "function") {
      return 0;
    }

    const casedOp = op;

    for (i = 0, len = this.options.PRECEDENCE.length; i !== len; ++i) {
      if (this.options.PRECEDENCE[i].includes(casedOp)) {
        return i;
      }
    }
    return i;
  }

  resolveAmbiguity(token: string) {
    return this.options?.AMBIGUOUS[token] ?? token;
  }

  tokenize(expression: string) {
    const tokens: string[] = [];
    let token = "";
    let isScanningLiteral = false;
    let isScanningSymbols = false;
    let isEscaping = false;

    for (let i = 0; i < expression.length; i++) {
      const currChar = expression[i];

      if (isEscaping) {
        token += currChar;
        isEscaping = false;
        continue;
      }

      if (currChar === this.options.ESCAPE_CHAR) {
        isEscaping = true;
        continue;
      }

      if (isScanningLiteral) {
        if (currChar === this.options.LITERAL_CLOSE) {
          tokens.push(this.options.LITERAL_OPEN + token + this.options.LITERAL_CLOSE);
          token = "";
          isScanningLiteral = false;
        } else {
          token += currChar;
        }
        continue;
      }

      if (currChar === this.options.LITERAL_OPEN) {
        tokens.push(token);
        token = "";
        isScanningLiteral = true;
        continue;
      }

      if (currChar === this.options.SEPARATOR) {
        if (token !== "") {
          tokens.push(token);
          token = "";
        }
        continue;
      }

      if (currChar === this.options.GROUP_OPEN || currChar === this.options.GROUP_CLOSE) {
        if (token !== "") {
          tokens.push(token);
          token = "";
        }
        tokens.push(currChar);
        continue;
      }

      if (currChar in this.surroundingOpen || currChar in this.surroundingClose) {
        if (token !== "") {
          tokens.push(token);
          token = "";
        }
        tokens.push(currChar);
        continue;
      }

      const isSymbol = this.isSymbol(currChar);
      if (isSymbol !== isScanningSymbols) {
        if (token !== "") {
          tokens.push(token);
          token = "";
        }
        isScanningSymbols = isSymbol;
      }

      token += currChar;
    }

    if (token !== "") {
      tokens.push(token);
    }

    return tokens.map((t) => this.resolveAmbiguity(t));
  }

  isSurroundingOpen(token: string) {
    return this.surroundingOpen[token] !== undefined;
  }

  isSurroundingClose(token: string) {
    return this.surroundingClose[token] !== undefined;
  }

  getSurroundingToken(token: string) {
    return this.surroundingClose[token];
  }

  tokensToRpn(tokens: string[]) {
    const output: string[] = [];
    const stack: string[] = [];
    const grouping: string[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const token of tokens) {
      const isInfix = this.getInfixOp(token) !== undefined;
      const isPrefix = this.getPrefixOp(token) !== undefined;

      if (isInfix || isPrefix) {
        const tokenPrecedence = this.getPrecedence(token);
        let lastInStack = stack[stack.length - 1];

        while (lastInStack
          && ((!!this.getPrefixOp(lastInStack) && this.getPrecedence(lastInStack) < tokenPrecedence)
            || (!!this.getInfixOp(lastInStack) && this.getPrecedence(lastInStack) <= tokenPrecedence))) {
          output.push(stack.pop() as string);
          lastInStack = stack[stack.length - 1];
        }

        stack.push(token);
      } else if (this.isSurroundingOpen(token)) {
        stack.push(token);
        grouping.push(token);
      } else if (this.isSurroundingClose(token)) {
        const surroundingToken = this.getSurroundingToken(token);

        if (grouping.pop() !== surroundingToken.OPEN) {
          throw new Error(`Mismatched Grouping (unexpected closing "${token}")`);
        }

        let poppedToken = stack.pop();

        while (poppedToken !== surroundingToken.OPEN && poppedToken !== undefined) {
          output.push(poppedToken);
          poppedToken = stack.pop();
        }

        if (poppedToken === undefined) {
          throw new Error("Mismatched Grouping");
        }

        stack.push(surroundingToken.ALIAS);
      } else if (token === this.options.GROUP_OPEN) {
        stack.push(token);
        grouping.push(token);
      } else if (token === this.options.GROUP_CLOSE) {
        if (grouping.pop() !== this.options.GROUP_OPEN) {
          throw new Error(`Mismatched Grouping (unexpected closing "${token}")`);
        }

        let poppedToken = stack.pop();

        while (poppedToken !== this.options.GROUP_OPEN && poppedToken !== undefined) {
          output.push(poppedToken);
          poppedToken = stack.pop();
        }

        if (poppedToken === undefined) {
          throw new Error("Mismatched Grouping");
        }
      } else {
        output.push(token);
      }
    }

    while (stack.length !== 0) {
      const token = stack.pop() as string;

      if (this.isSurroundingClose(token)) {
        const surroundingToken = this.getSurroundingToken(token);

        if (grouping.pop() !== surroundingToken.OPEN) {
          throw new Error(`Mismatched Grouping (unexpected closing "${token}")`);
        }
      } else if (token === this.options.GROUP_CLOSE) {
        if (grouping.pop() !== this.options.GROUP_OPEN) {
          throw new Error(`Mismatched Grouping (unexpected closing "${token}")`);
        }
      }

      output.push(token);
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
    let lhs;
    let rhs;

    const token = stack.pop();

    if (typeof token === "undefined") {
      throw new Error("Parse Error: unexpected EOF");
    }

    const isInfixDelegate = !!this.getInfixOp(token);
    const isPrefixDelegate = !!this.getPrefixOp(token);

    const isInfix = isInfixDelegate && stack.length > 1;
    const isPrefix = isPrefixDelegate && stack.length > 0;

    if (isInfix || isPrefix) {
      rhs = this.evaluateRpn<T>(stack, infixer, prefixer, terminator, terms);
    }

    if (isInfix) {
      lhs = this.evaluateRpn<T>(stack, infixer, prefixer, terminator, terms);
      return infixer(token, lhs, rhs as T);
    } if (isPrefix) {
      return prefixer(token, rhs as T);
    }
    return terminator(token, terms);
  }

  rpnToThunk(stack: string[], terms?: Record<string, ExpressionValue>) {
    const infixExpr: Infixer<ExpressionThunk> = (term, lhs, rhs) => thunk(this.getInfixOp(term), lhs, rhs);
    const prefixExpr: Prefixer<ExpressionThunk> = (term, rhs) => thunk(this.getPrefixOp(term), rhs);
    const termExpr: Terminator<ExpressionThunk> = (term, terms) => {
      if (this.options?.LITERAL_OPEN && term.startsWith(this.options.LITERAL_OPEN)) {
        // Literal string
        return () => term.replace(this.LIT_OPEN_REGEX, "").replace(this.LIT_CLOSE_REGEX, "");
      }
      return terms?.hasOwnProperty(term) ? () => terms[term] : thunk(this.options.termDelegate as any, term);
    };

    return this.evaluateRpn(stack, infixExpr, prefixExpr, termExpr, terms);
  }

  rpnToValue(stack: string[], terms?: Record<string, ExpressionValue>): ExpressionValue {
    return evaluate(this.rpnToThunk(stack, terms));
  }

  expressionToValue(expression: string, terms: Record<string, ExpressionValue>) {
    return this.rpnToValue(this.tokensToRpn(this.tokenize(expression)), terms);
  }
}

export default ExpressionParser;
