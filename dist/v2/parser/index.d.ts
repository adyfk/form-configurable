import ExpressionParser from "./expression";
export declare const createParser: (config?: (termDelegate: import("./expression").TermDelegate, termTypeDelegate?: import("./expression").TermTyper | undefined) => import("./expression").ExpressionParserOptions) => ExpressionParser;
