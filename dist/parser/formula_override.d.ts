import type { ExpressionThunk, TermDelegate, ExpressionValue, ExpressionParserOptions, TermTyper, ArgumentsArray } from 'expressionparser/dist/ExpressionParser';
export interface FunctionOps {
    [op: string]: (...args: ExpressionThunk[]) => ExpressionValue;
}
export declare const isArgumentsArray: (args: ExpressionValue) => args is ArgumentsArray;
export declare const formula: (termDelegate: TermDelegate, termTypeDelegate?: TermTyper) => ExpressionParserOptions;
export default formula;
