import type { Schema } from 'src/types/schema';
import { validate } from './validate';

const schema: Schema[] = [
  {
    variant: 'FIELD',
    fieldType: 'ARRAY',
    fieldName: 'myarray',
    initialValue: [
      { name: '', last: '' },
      { name: '1', last: '1' },
    ],
    child: [
      {
        variant: 'FIELD',
        fieldName: 'name',
        initialValue: '',
        fieldType: 'TEXT',
        valueType: 'STRING',
        meta: {
          label: 'Input Name Array',
        },
        rules: [
          { error: 'Error', expression: '!GET("name", INDEX(myarray, __INDEX__))' },
        ],
      },
      {
        variant: 'FIELD',
        fieldName: 'last',
        initialValue: '',
        fieldType: 'TEXT',
        valueType: 'STRING',
        meta: {
          label: 'Input Name Array',
        },
        rules: [
          { error: 'Error', expression: '!GET("last",INDEX(myarray,__INDEX__))' },
        ],
      },
    ],
  },
  {
    fieldName: 'firstName',
    fieldType: 'TEXT',
    valueType: 'STRING',
    initialValue: '',
    variant: 'FIELD',
    rules: [{ error: 'FirstName Is Required', expression: '!firstName' }],
  },
  {
    fieldName: 'lastName',
    fieldType: 'TEXT',
    valueType: 'STRING',
    initialValue: '',
    variant: 'FIELD',
    rules: [{ error: 'LastName Is Required', expression: '!lastName' }],
  },
  {
    variant: 'GROUP',
    groupType: 'DEFAULT',
    child: [
      {
        fieldName: 'age',
        fieldType: 'TEXT',
        valueType: 'NUMBER',
        variant: 'FIELD',
        initialValue: 0,
        rules: [
          { error: 'Age Should Higher Than 21', expression: '!(age > 20)' },
        ],
      },
    ],
    meta: {},
  },
];

test('validate test error field', () => {
  const result = validate(schema, {
    firstName: '',
    lastName: 'the last name',
    age: 20,
  });
  expect(result).toEqual({
    firstName: 'FirstName Is Required',
    age: 'Age Should Higher Than 21',
    'myarray[0].last': 'Error',
    'myarray[0].name': 'Error',
  });
});
