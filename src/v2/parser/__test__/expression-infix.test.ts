import { createParser } from "..";
import { ExampleInfix } from "../example";

const parser = createParser();
const terms = {};

describe("test infix ops", () => {
  Object.entries(ExampleInfix).forEach(([key, prop]) => {
    it(`${key} | (${prop.expression} = ${prop.result})`, () => {
      expect(parser.expressionToValue(prop.expression, terms)).toEqual(prop.result);
    });
  });
});