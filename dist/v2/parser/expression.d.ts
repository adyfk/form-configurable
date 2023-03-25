export type ExpressionPrimitive = number | boolean | string;
export type ExpressionThunk = (..._args: ExpressionValue[]) => ExpressionValue;
export type ExpressionThunkArray = ExpressionThunk[] & {
    isExpressionArgumentsArray?: boolean;
};
export type ExpressionValueArray = ExpressionValue[] & {
    isExpressionArgumentsArray?: boolean;
};
export type ExpressionObject = {
    [key: string]: ExpressionValue;
};
export type ExpressionThunkFunction = (..._args: ExpressionThunk[]) => ExpressionValue;
export type ExpressionValue = ExpressionPrimitive | ExpressionThunk | ExpressionThunkArray | ExpressionValueArray | ExpressionObject | ExpressionThunkFunction;
export type TermDelegate = (_term: string) => ExpressionValue;
export type TermType = "number" | "boolean" | "string" | "function" | "array" | "object" | "unknown";
export type TermTyper = (_term: string) => TermType;
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
export declare const isExpressionArgumentsArray: (args: ExpressionValue) => args is ExpressionThunkArray;
declare class ExpressionParser {
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
    LIT_CLOSE_REGEX: RegExp;
    LIT_OPEN_REGEX: RegExp;
    constructor(options: ExpressionParserOptions);
    isSymbol(char: string): boolean;
    getPrefixOp(op: string): ExpressionThunk;
    getInfixOp(op: string): ExpressionThunk;
    getPrecedence(op: string): number;
    resolveAmbiguity(token: string): string;
    tokenize(expression: string): string[];
    isSurroundingOpen(token: string): boolean;
    isSurroundingClose(token: string): boolean;
    getSurroundingToken(token: string): {
        OPEN: string;
        ALIAS: string;
    };
    tokensToRpn(tokens: string[]): string[];
    evaluateRpn<T>(stack: string[], infixer: Infixer<T>, prefixer: Prefixer<T>, terminator: Terminator<T>, terms?: Record<string, ExpressionValue>): T;
    rpnToThunk(stack: string[], terms?: Record<string, ExpressionValue>): ExpressionThunk;
    rpnToValue(stack: string[], terms?: Record<string, ExpressionValue>): ExpressionValue;
    expressionToValue(expression: string, terms: Record<string, ExpressionValue>): ExpressionValue;
}
export default ExpressionParser;
