/* eslint-disable no-console */
import { createParser } from "..";

test("init expression", () => {
  const parser = createParser();
  const expression = "2+3+4+55+2+(4 + 2) + -334 + 4 + x\\";
  const terms = { x: 20 };

  const tokenize = parser.tokenize(expression);
  expect(tokenize).toEqual(
    [
      "2", "+", "3", "+", "4",
      "+", "55", "+", "2", "+",
      "(", "4", "+", "2", ")",
      "+", "NEG", "334", "+", "4",
      "+", "x",
    ],
  );

  const tokenToRpn = parser.tokensToRpn(tokenize);
  expect(tokenToRpn).toEqual(
    [
      "2", "3", "+", "4",
      "+", "55", "+", "2",
      "+", "4", "2", "+",
      "+", "334", "NEG", "+",
      "4", "+", "x", "+",
    ],
  );

  // const rpnToThunk = parser.rpnToThunk(tokenToRpn, terms);
  // console.log(rpnToThunk);

  const rpnToValue = parser.rpnToValue(tokenToRpn, terms);
  expect(rpnToValue).toBe(-238);

  // console.log(rpnToValue);
  // const range: any = [];
  // Array.from({ length: 9999 }).forEach(() => {
  //   const start = performance.now();

  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   parser.tokensToRpn(tokenize);
  //   const duration = performance.now() - start;
  //   range.push(duration);
  // });
  // const avarage = range.reduce((acc: any, item: any) => {
  //   if (!acc) return item;
  //   return (acc + item) / 2;
  // }, 0);
  // console.log(avarage);

  expect(parser.expressionToValue(expression, terms)).toBe(-238);
});
