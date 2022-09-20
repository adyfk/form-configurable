import { Schema } from '../types/schema';
import validate from './validate';

test('validate values', () => {
  const schema: Schema[] = [
    {
      variant: 'FIELD',
      fieldName: 'name',
      initialValue: '',
      fieldType: 'TEXT',
      valueType: 'STRING',
      meta: {
        label: 'Name',
      },
      rules: [
        {
          error: 'Required Field',
          expression: '!name',
        },
      ],
    },
    {
      variant: 'VIEW',
      meta: {
        title: 'View Title Information',
      },
      props: [{ name: 'show', expression: 'name' }],
    },
    {
      variant: 'GROUP',
      meta: {
        title: 'Group Title Information',
      },
      props: [{ name: 'show', expression: 'name' }],
      child: [
        {
          variant: 'FIELD',
          fieldName: 'address',
          initialValue: '',
          fieldType: 'TEXT',
          valueType: 'STRING',
          meta: {
            label: 'Address',
          },
        },
        {
          variant: 'VIEW',
          meta: {
            title: 'View Title Information',
          },
        },
      ],
    },
  ];
  const result = validate(schema, {
    name: '',
  });
  expect(result).toEqual({
    name: 'Required Field',
  });
});
