import schema from '../demo/pages/form/data-demo.json';
import validate from './validate';

test('validate required', () => {
  const payload = {
    firstValue: 0,
    secondValue: 0,
    result: 0,
  };

  const result = validate(payload, schema as any);
  expect(result).toEqual({ firstValue: 'required', secondValue: 'required' });
});

test('validate fistValue heigher than secondValue', () => {
  const payload = {
    firstValue: 5,
    secondValue: 0,
    result: 10,
  };

  const result = validate(payload, schema as any);
  expect(result).toEqual({
    firstValue: 'should lower than second value',
    secondValue: 'required',
  });
});

test('validate onlyFirstError', () => {
  const payload = {
    firstValue: 5,
    secondValue: 0,
    result: 10,
  };

  const result = validate(payload, schema as any, { onlyFirstError: true });
  expect(result).toEqual({
    firstValue: 'should lower than second value',
  });
});
