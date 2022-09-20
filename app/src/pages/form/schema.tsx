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
