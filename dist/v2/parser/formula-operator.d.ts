import { ExpressionThunk, ExpressionThunkArray, ExpressionValue } from "./expression";
type CallbackFn = (..._args: ExpressionThunk[]) => ExpressionValue;
interface prefixOpsFormula {
    [op: string]: CallbackFn;
}
interface InfixOpsFormula {
    [op: string]: CallbackFn;
}
export declare function call(name: string): (..._args: ExpressionThunkArray) => ExpressionValue;
export declare const infixOperator: InfixOpsFormula;
export declare const prefixOperator: prefixOpsFormula;
export {};
