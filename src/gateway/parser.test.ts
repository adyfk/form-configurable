import { expressionToValue } from './parser';
test('test parser', () => {
  expect(expressionToValue('2 + 2', {})).toBe(4);
});
