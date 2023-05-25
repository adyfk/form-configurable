import { createParser } from "..";
import {
  ExampleBoolean,
  ExamplePrefixArray,
  ExamplePrefixDate,
  ExamplePrefixIsCondition,
  ExamplePrefixNumber,
  ExamplePrefixObject,
  ExamplePrefixString,
  ExampleTerms,
} from "../example";
import "core-js";
// import { ExampleInfix } from "../example-infix";

const parser = createParser();

const TestGroup = [
  ["is-condition", ExamplePrefixIsCondition],
  ["date", ExamplePrefixDate],
  ["string", ExamplePrefixString],
  ["number", ExamplePrefixNumber],
  ["boolean", ExampleBoolean],
  ["array", ExamplePrefixArray],
  ["object", ExamplePrefixObject],
];

TestGroup.forEach(([group, reference]) => {
  describe(`test prefix ${group} ops`, () => {
    Object.entries(reference).forEach(([key, prop]: any) => {
      it(`${key} | (${prop.expression} = ${prop.result})`, () => {
        expect(parser.expressionToValue(prop.expression, ExampleTerms)).toEqual(prop.result);
      });
    });
  });
});
