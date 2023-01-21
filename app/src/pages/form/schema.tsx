import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import JsonEditor from '../../components/json-editor';
import { useEffect, useState } from 'react';
import { Schema } from 'form-configurable';
import { IconButton, styled } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
// import schema from './data-demo.json';
// import { FieldType, ValueType } from 'gateway';


const schema: Schema[] = [
  {
    variant: 'FIELD',
    fieldType: 'CUSTOM',
    fieldName: 'custom',
    initialValue: {},
    style: {
      container: {
        xs: 12,
      },
    },
  },
  {
    variant: 'FIELD',
    fieldType: 'FILE',
    fieldName: 'file',
    initialValue: [],
    meta: {
      label: 'File',
    },
    style: {
      container: {
        xs: 12,
        md: 12,
        lg: 12,
      },
    },
  },
  {
    variant: 'FIELD',
    fieldType: 'RADIO',
    fieldName: 'radio',
    initialValue: { label: '', value: '' },
    meta: {
      label: 'Radio',
      options: [
        { label: 'Radio 1', value: 1 },
        { label: 'Radio 2', value: 2 },
        { label: 'Radio 3', value: 3 },
      ],
    },
    style: {
      container: {
        xs: 12,
        md: 8,
        lg: 6,
      },
    },
    rules: [{ error: 'Required', expression: '!GET("value", radio)' }],
  },
  {
    variant: 'FIELD',
    fieldType: 'CHECKBOX',
    fieldName: 'checkbox_number',
    initialValue: [],
    meta: {
      label: 'CHECKBOX NUMBER',
      options: [
        { label: 'Checkbox 1 Number', value: 1 },
        { label: 'Checkbox 2 Number', value: 2 },
        { label: 'Checkbox 3 Number', value: 3 },
      ],
    },
    rules: [
      { error: 'Required', expression: 'LENGTH(checkbox_number) = 0' },
    ],
    style: {
      container: {
        xs: 12,
        md: 8,
        lg: 6,
      },
    },
    props: [{ name: 'editable', expression: '!!GET("value", radio)' }],
  },
  {
    variant: 'FIELD',
    fieldType: 'CHECKBOX',
    fieldName: 'checkbox_string',
    initialValue: [],
    meta: {
      label: 'CHECKBOX STRING',
      options: [
        { label: 'Checkbox 1 String', value: '1' },
        { label: 'Checkbox 2 String', value: '2' },
        { label: 'Checkbox 3 String', value: '3' },
      ],
    },
    rules: [
      { error: 'Required', expression: 'LENGTH(checkbox_string) = 0' },
    ],
    style: {
      container: {
        xs: 12,
        md: 8,
        lg: 6,
      },
    },
  },
  {
    variant: 'FIELD',
    fieldType: 'DROPDOWN',
    fieldName: 'dropdown_number',
    initialValue: { label: '', value: '' },
    meta: {
      label: 'DROPDOWN NUMBER',
      options: [
        { label: 'Dropdown 1 Number', value: 1 },
        { label: 'Dropdown 2 Number', value: 2 },
        { label: 'Dropdown 3 Number', value: 3 },
      ],
    },
    rules: [
      { error: 'Required', expression: '!GET("value", dropdown_number)' },
    ],
    style: {
      container: {
        xs: 12,
        md: 8,
        lg: 6,
      },
    },
  },
  {
    variant: 'FIELD',
    fieldType: 'DROPDOWN',
    fieldName: 'dropdown_string',
    initialValue: { label: '', value: '' },
    meta: {
      label: 'DROPDOWN STRING',
      options: [
        { label: 'Dropdown 1 String', value: '1' },
        { label: 'Dropdown 2 String', value: '2' },
        { label: 'Dropdown 3 String', value: '3' },
      ],
    },
    rules: [
      { error: 'Required', expression: '!GET("value", dropdown_string)' },
    ],
    style: {
      container: {
        xs: 12,
        md: 8,
        lg: 6,
      },
    },
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
    rules: [{ error: 'Required', expression: '!date' }],
    style: {
      container: {
        xs: 12,
        md: 8,
        lg: 6,
      },
    },
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
    style: {
      container: {
        xs: 12,
        md: 8,
        lg: 6,
      },
    },
  },
  {
    variant: 'FIELD',
    fieldName: 'name',
    initialValue: '',
    fieldType: 'TEXT',
    valueType: 'STRING',
    meta: {
      label: 'Input name to show hidden field',
    },
    rules: [
      {
        error: 'Required Field',
        expression: '!name',
      },
    ],
    style: {
      container: {
        xs: 12,
        md: 8,
        lg: 6,
      },
    },
  },
  {
    variant: 'VIEW',
    meta: {
      title: 'View Title Information',
    },
    props: [{ name: 'show', expression: 'name' }],
    style: {
      container: {
        xs: 12,
      },
    },
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
    style: {
      container: {
        xs: 12,
      },
    },
  },
]

const Input = styled('input')({
  display: 'none',
});

function JsonSchema({ onLoad }: { onLoad: any }) {
  const [renderJson, setRenderJson] = useState(true);
  const [value, setValue] = useState<{
    extraData: any;
    schema: Schema[];
  }>({
    extraData: {},
    schema: [
      ...schema
    ],
  });

  useEffect(() => {
    if (!renderJson) setRenderJson(true);
  }, [renderJson]);

  return (
    <>
      <Box
        display={'flex'}
        justifyContent="space-between"
        alignItems={'center'}
      >
        <Typography py={2}>
          Object Schema{' '}
          <label htmlFor="upload-json">
            <Input
              onChange={async (e) => {
                try {
                  const reader = new FileReader();
                  reader.readAsText(e.target.files?.[0] as any, 'UTF-8');
                  reader.onload = (e) => {
                    setValue(JSON.parse(e.target?.result as any));
                    setRenderJson(false);
                  };
                } catch (error) {}
              }}
              accept={'application/JSON'}
              id="upload-json"
              type="file"
            />
            <IconButton size="small" component="span">
              <UploadFile />
            </IconButton>
          </label>
        </Typography>
        <Button onClick={() => onLoad(value)} variant="outlined" size="small">
          Implement To Form
        </Button>
      </Box>
      {renderJson && <JsonEditor value={value} onChange={setValue} />}
    </>
  );
}

export default JsonSchema;
