import { Schema } from '../types/schema';
import { generateInitialValues } from './generateInitialValues';

test('generate values', () => {
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
      viewType: 'DEFAULT',
      meta: {
        title: 'View Title Information',
      },
      props: [{ name: 'show', expression: 'name' }],
    },
    {
      variant: 'GROUP',
      groupType: 'DEFAULT',
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
          viewType: 'DEFAULT',
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
  expect(result).toEqual([
    {
      variant: 'FIELD',
      fieldName: 'name',
      initialValue: 'Test Name',
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
      viewType: 'DEFAULT',
      meta: {
        title: 'View Title Information',
      },
      props: [{ name: 'show', expression: 'name' }],
    },
    {
      variant: 'GROUP',
      groupType: 'DEFAULT',
      meta: {
        title: 'Group Title Information',
      },
      props: [{ name: 'show', expression: 'name' }],
      child: [
        {
          variant: 'FIELD',
          fieldName: 'address',
          initialValue: 'Test Address',
          fieldType: 'TEXT',
          valueType: 'STRING',
          meta: {
            label: 'Address',
          },
        },
        {
          variant: 'VIEW',
          viewType: 'DEFAULT',
          meta: {
            title: 'View Title Information',
          },
        },
      ],
    },
  ]);
});
