import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import JsonEditor from '../../components/json-editor';
import { useState } from 'react';
import { FieldType, ValueType } from 'gateway';

function JsonSchema({ onLoad }: { onLoad: any }) {
  const [value, setValue] = useState({
    extraData: {},
    schema: [
      {
        fieldName: 'firstValue',
        fieldType: FieldType.TEXT,
        valueType: ValueType.NUMBER,
        config: [],
        initialValue: '',
        meta: {
          label: 'First Value',
          placeholder: 'Input Number',
        },
        style: {},
        rules: [
          {
            error: 'required',
            expression: '!firstValue',
          },
          {
            error: 'should lower than second value',
            expression: 'firstValue > secondValue',
          },
        ],
      },
      {
        fieldName: 'secondValue',
        fieldType: FieldType.TEXT,
        valueType: ValueType.NUMBER,
        config: [{ name: 'show', expression: 'firstValue' }],
        initialValue: '',
        meta: {
          label: 'Second Value',
          placeholder: 'Input Number',
        },
        rules: [{ expression: '!secondValue', error: 'required' }],
        style: {},
      },
      {
        fieldName: 'result',
        fieldType: FieldType.TEXT,
        valueType: ValueType.NUMBER,
        config: [{ name: 'editable', value: false }],
        initialValue: 0,
        meta: {
          label: 'Result',
          placeholder: 'result',
        },
        style: {},
        rules: [],
        override: {
          self: 'firstValue + secondValue',
        },
      },
    ],
    object: 1,
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
