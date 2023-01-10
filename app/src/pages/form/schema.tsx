import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import JsonEditor from '../../components/json-editor';
import { useState } from 'react';
import { Schema } from 'form-configurable';
// import schema from './data-demo.json';
// import { FieldType, ValueType } from 'gateway';

function JsonSchema({ onLoad }: { onLoad: any }) {
  const [value, setValue] = useState<{
    extraData: any;
    schema: Schema[];
  }>({
    extraData: {},
    schema: [
      {
        variant: 'FIELD',
        fieldType: 'CHECKBOX',
        fieldName: 'checkbox_number',
        initialValue: [],
        meta: {
          label: 'CHECKBOX NUMBER',
          placeholder: 'Placeholder',
          options: [
            { label: 'Checkbox 1 Number', value: 1 },
            { label: 'Checkbox 2 Number', value: 2 },
            { label: 'Checkbox 3 Number', value: 3 },
          ],
        },
        rules: [
          { error: 'Required', expression: 'LENGTH(checkbox_number) = 0' },
        ],
      },
      {
        variant: 'FIELD',
        fieldType: 'CHECKBOX',
        fieldName: 'checkbox_string',
        initialValue: [],
        meta: {
          label: 'CHECKBOX STRING',
          placeholder: 'Placeholder',
          options: [
            { label: 'Checkbox 1 String', value: '1' },
            { label: 'Checkbox 2 String', value: '2' },
            { label: 'Checkbox 3 String', value: '3' },
          ],
        },
        rules: [
          { error: 'Required', expression: 'LENGTH(checkbox_string) = 0' },
        ],
      },
      {
        variant: 'FIELD',
        fieldType: 'DROPDOWN',
        fieldName: 'dropdown_number',
        initialValue: { label: '', value: '' },
        meta: {
          label: 'DROPDOWN NUMBER',
          placeholder: 'Placeholder',
          options: [
            { label: 'Dropdown 1 Number', value: 1 },
            { label: 'Dropdown 2 Number', value: 2 },
            { label: 'Dropdown 3 Number', value: 3 },
          ],
        },
        rules: [
          { error: 'Required', expression: '!GET("value", dropdown_number)' },
        ],
      },
      {
        variant: 'FIELD',
        fieldType: 'DROPDOWN',
        fieldName: 'dropdown_string',
        initialValue: { label: '', value: '' },
        meta: {
          label: 'DROPDOWN STRING',
          placeholder: 'Placeholder',
          options: [
            { label: 'Dropdown 1 String', value: '1' },
            { label: 'Dropdown 2 String', value: '2' },
            { label: 'Dropdown 3 String', value: '3' },
          ],
        },
        rules: [
          { error: 'Required', expression: '!GET("value", dropdown_string)' },
        ],
      },
      {
        variant: 'FIELD',
        fieldName: 'date',
        fieldType: 'DATE',
        valueType: 'DATE',
        initialValue: '',
        meta: {
          label: 'Date',
          format: 'DD/MM/YYYY',
        },
        rules: [],
      } as any,
      {
        variant: 'FIELD',
        fieldName: 'number',
        initialValue: '',
        fieldType: 'TEXT',
        valueType: 'NUMBER',
        meta: {
          label: 'Number',
        },
        rules: [
          {
            error: 'Should greather than 0',
            expression: 'number <= 0',
          },
        ],
      },
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
    ],
  });

  return (
    <>
      <Box
        display={'flex'}
        justifyContent="space-between"
        alignItems={'center'}
      >
        <Typography py={2}>Object Schema</Typography>
        <Button onClick={() => onLoad(value)} variant="outlined" size="small">
          Implement To Form
        </Button>
      </Box>
      <JsonEditor value={value} onChange={setValue} />
    </>
  );
}

export default JsonSchema;
