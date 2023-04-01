/* eslint-disable no-console */
import { createParser } from "..";

test("init expression", () => {
  const parser = createParser();
  const expression = "2+3+4+55+2+(4 + 2) + -334 + 4 + x";
  const terms = { x: 20 };

  expect(parser.expressionToValue(expression, terms)).toBe(-238);
  expect(parser.expressionToValue("20 > 10", terms)).toBe(true);
  expect(parser.expressionToValue("10 > 20", terms)).toBe(false);
  expect(parser.expressionToValue("10 < 20", terms)).toBe(true);
  expect(parser.expressionToValue("20 < 10", terms)).toBe(false);
});
