import type {
  InfixOps,
  ExpressionValue,
  ExpressionArray,
  ArgumentsArray,
} from "expressionparser/dist/ExpressionParser";
import {
  isArgumentsArray,
  num,
} from "./formula-utils";

export const INFIX_OPS: InfixOps = {
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