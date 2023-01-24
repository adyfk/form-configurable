/* eslint-disable jest/expect-expect */
import createForm from './createForm';

test('create-form', () => {
  const form = createForm({
    schema: [
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
    ],
  });

  form.executeConfig();

  expect(form.fields).toEqual({
    error: {
      'myarray[0].name': 'Error',
      'myarray[0].last': 'Error',
    },
    touched: {},
  });
});
