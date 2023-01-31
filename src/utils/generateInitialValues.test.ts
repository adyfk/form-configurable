import { Schema } from '../types/schema';
import { generateInitialValues } from './generateInitialValues';

// eslint-disable-next-line jest/expect-expect
test('generate values', () => {
  const schema: Schema[] = [
    {
      variant: 'FIELD',
      name: 'name',
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
      viewType: 'DIVIDER',
      meta: {
        title: 'View Title Information',
      },
      props: [{ name: 'show', expression: 'name' }],
    },
    {
      variant: 'GROUP',
      groupType: 'ACCORDION',
      meta: {
        title: 'Group Title Information',
      },
      props: [{ name: 'show', expression: 'name' }],
      child: [
        {
          variant: 'FIELD',
          name: 'address',
          initialValue: '',
          fieldType: 'TEXT',
          valueType: 'STRING',
          meta: {
            label: 'Address',
          },
        },
        {
          variant: 'VIEW',
          viewType: 'DIVIDER',
          meta: {
            title: 'View Title Information',
          },
        },
      ],
    },
  ];
  const result = generateInitialValues(schema, {
    name: 'Test Name',
    address: 'Test Address',
  });
  console.log(result);
});
