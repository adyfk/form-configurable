/* eslint-disable jest/expect-expect */
import createForm from './createForm';

test('create-form', () => {
  const form = createForm({
    schema: [
      {
        key: 'FORMNAME_FIELD_field_array',
        variant: 'FIELD',
        fieldType: 'ARRAY',
        name: 'arrayobjectfield',
        initialValue: [],
        style: {
          container: {
            lg: 12,
            md: 12,
            sm: 12,
          },
        },
        child: [
          {
            key: 'FORMNAME_FIELD_field_array_field_text_string',
            variant: 'FIELD',
            fieldType: 'TEXT',
            valueType: 'STRING',
            name: 'field_text_string_1',
            initialValue: '',
            rules: [
              { error: 'Harus Terisi', expression: '!GET("field_text_string_1", INDEX(arrayobjectfield, __INDEX__))' },
            ],
            meta: {
              label: 'INPUT FIELD TEXT STRING REQUIRED',
            },
            style: {
              container: {
                lg: 6,
                md: 10,
                sm: 12,
              },
            },
          },
          {
            key: 'FORMNAME_FIELD_field_array_field_text_string_2',
            variant: 'FIELD',
            fieldType: 'TEXT',
            valueType: 'STRING',
            name: 'field_text_string_2',
            initialValue: '',
            rules: [
              { error: 'Harus Terisi', expression: '!GET("field_text_string_2", INDEX(arrayobjectfield, __INDEX__))' },
            ],
            meta: {
              label: 'INPUT FIELD TEXT STRING',
            },
            props: [
              { name: 'show', expression: 'GET("field_text_string_1", INDEX(arrayobjectfield, __INDEX__))' },
            ],
            style: {
              container: {
                lg: 6,
                md: 10,
                sm: 12,
              },
            },
          },
        ],
      },
      {
        key: 'FORMNAME_FIELD_field_text_string',
        variant: 'FIELD',
        fieldType: 'TEXT',
        valueType: 'STRING',
        name: 'field_text_string',
        initialValue: '',
        rules: [
          { error: 'Harus Terisi', expression: '!field_text_string' },
        ],
        meta: {
          label: 'INPUT FIELD TEXT STRING',
        },
        style: {
          container: {
            lg: 6,
            md: 10,
            sm: 12,
          },
        },
      },
      {
        key: 'FORMNAME_FIELD_field_text_number',
        variant: 'FIELD',
        fieldType: 'TEXT',
        valueType: 'NUMBER',
        name: 'field_text_number',
        initialValue: 0,
        rules: [
          { error: 'Harus > 20', expression: 'field_text_number < 20' },
        ],
        props: [
          { name: 'show', expression: 'field_text_string' },
          { name: 'editable', expression: 'field_text_string' },
        ],
        meta: {
          label: 'INPUT FIELD TEXT NUMBER',
        },
        style: {
          container: {
            lg: 6,
            md: 10,
            sm: 12,
          },
        },
      },
      {
        key: 'FORMNAME_FIELD_field_textarea_string',
        variant: 'FIELD',
        fieldType: 'TEXTAREA',
        valueType: 'STRING',
        name: 'field_textarea_string',
        initialValue: '',
        rules: [
          { error: 'Harus terisi', expression: '!field_textarea_string' },
        ],
        props: [
          { name: 'show', expression: 'field_text_string' },
        ],
        meta: {
          label: 'INPUT FIELD TEXTAREA STRING',
        },
        style: {
          container: {
            lg: 6,
            md: 10,
            sm: 12,
          },
        },
      },
      {
        key: 'FORMNAME_FIELD_field_wyswyg_string',
        variant: 'FIELD',
        fieldType: 'WYSWYG',
        valueType: 'STRING',
        name: 'field_wyswyg_string',
        initialValue: '',
        rules: [
          { error: 'Harus terisi', expression: '!field_wyswyg_string' },
        ],
        props: [
          { name: 'show', expression: 'field_text_string' },
        ],
        meta: {
          label: 'INPUT FIELD WYSWYG STRING',
        },
        style: {
          container: {
            lg: 6,
            md: 10,
            sm: 12,
          },
        },
      },
      {
        key: 'FORMNAME_FIELD_field_checkbox_1',
        variant: 'FIELD',
        fieldType: 'CHECKBOX',
        name: 'field_checkbox_1',
        initialValue: [],
        meta: {
          label: 'INPUT FIELD CHECKBOX 1',
          options: [
            { label: 'CHECK 1', value: 'check 1' },
            { label: 'CHECK 2', value: 'check 2' },
          ],
        },
        style: {
          container: {
            lg: 6,
            md: 10,
            sm: 12,
          },
        },
      },
      {
        key: 'FORMNAME_FIELD_field_checkbox_2',
        variant: 'FIELD',
        fieldType: 'CHECKBOX',
        name: 'field_checkbox_2',
        initialValue: [],
        meta: {
          label: 'INPUT FIELD CHECKBOX 2',
          options: [
            { label: 'CHECK 1', value: 'check 1' },
            { label: 'CHECK 2', value: 'check 2' },
          ],
          row: true,
        },
        style: {
          container: {
            lg: 6,
            md: 10,
            sm: 12,
          },
        },
      },
      {
        key: 'FORMNAME_FIELD_field_checkbox_3',
        variant: 'FIELD',
        fieldType: 'CHECKBOX',
        name: 'field_checkbox_3',
        initialValue: [],
        meta: {
          label: 'INPUT FIELD CHECKBOX 3',
          options: [
            { label: 'CHECK 1', value: 'check 1' },
            { label: 'CHECK 2', value: 'check 2' },
          ],
          other: true,
        },
        style: {
          container: {
            lg: 6,
            md: 10,
            sm: 12,
          },
        },
      },
      {
        key: 'FORMNAME_FIELD_field_radio_1',
        variant: 'FIELD',
        fieldType: 'RADIO',
        name: 'field_radio_1',
        initialValue: { value: '', label: '' },
        meta: {
          label: 'INPUT FIELD RADIO 1',
          options: [
            { label: 'RADIO 1', value: 'RADIO 1' },
            { label: 'RADIO 2', value: 'RADIO 2' },
          ],
        },
        style: {
          container: {
            lg: 6,
            md: 10,
            sm: 12,
          },
        },
      },
      {
        key: 'FORMNAME_FIELD_field_radio_2',
        variant: 'FIELD',
        fieldType: 'RADIO',
        name: 'field_radio_2',
        initialValue: { value: '', label: '' },
        meta: {
          label: 'INPUT FIELD RADIO 2',
          options: [
            { label: 'RADIO 1', value: 'RADIO 1' },
            { label: 'RADIO 2', value: 'RADIO 2' },
          ],
          row: true,
        },
        style: {
          container: {
            lg: 6,
            md: 10,
            sm: 12,
          },
        },
      },
      {
        key: 'FORMNAME_FIELD_field_radio_3',
        variant: 'FIELD',
        fieldType: 'RADIO',
        name: 'field_radio_3',
        initialValue: { value: '', label: '' },
        meta: {
          label: 'INPUT FIELD RADIO 3',
          options: [
            { label: 'RADIO 1', value: 'RADIO 1' },
            { label: 'RADIO 2', value: 'RADIO 2' },
          ],
          other: true,
        },
        style: {
          container: {
            lg: 6,
            md: 10,
            sm: 12,
          },
        },
      },
      {
        key: 'FORMNAME_FIELD_field_dropdown_1',
        variant: 'FIELD',
        fieldType: 'DROPDOWN',
        name: 'field_dropdown_1',
        initialValue: { value: '', label: '' },
        meta: {
          label: 'INPUT FIELD DROPDOWN 1',
          options: [
            { label: 'DROPDOWN 1', value: 'DROPDOWN 1' },
            { label: 'DROPDOWN 2', value: 'DROPDOWN 2' },
          ],
        },
        style: {
          container: {
            lg: 6,
            md: 10,
            sm: 12,
          },
        },
      },
      {
        key: 'FORMNAME_FIELD_field_dropdown_2',
        variant: 'FIELD',
        fieldType: 'DROPDOWN',
        name: 'field_dropdown_2',
        initialValue: { value: '', label: '' },
        meta: {
          label: 'INPUT FIELD DROPDOWN 2',
          options: [
            { label: 'DROPDOWN 1', value: 'DROPDOWN 1' },
            { label: 'DROPDOWN 2', value: 'DROPDOWN 2' },
          ],
          other: true,
        },
        style: {
          container: {
            lg: 6,
            md: 10,
            sm: 12,
          },
        },
      },
      {
        key: 'FORMNAME_FIELD_field_dropdown_async_1',
        variant: 'FIELD',
        fieldType: 'DROPDOWN-ASYNC',
        name: 'field_dropdown_async_1',
        initialValue: { value: '', label: '' },
        meta: {
          label: 'INPUT FIELD DROPDOWN ASYNC 1',
          optionUrl: '',
        },
        style: {
          container: {
            lg: 6,
            md: 10,
            sm: 12,
          },
        },
      },
      {
        key: 'FORMNAME_FIELD_field_dropdown_async_2',
        variant: 'FIELD',
        fieldType: 'DROPDOWN-ASYNC',
        name: 'field_dropdown_async_2',
        initialValue: { value: '', label: '' },
        meta: {
          label: 'INPUT FIELD DROPDOWN ASYNC 2',
          optionUrl: '',
          other: true,
        },
      },
      {
        key: 'FORMNAME_FIELD_field_counter',
        variant: 'FIELD',
        fieldType: 'COUNTER',
        name: 'field_counter',
        initialValue: 0,
        meta: {
          label: 'INPUT FIELD COUNTER',
          min: 10,
          max: 30,
        },
      },
      {
        key: 'FORMNAME_FIELD_field_switch',
        variant: 'FIELD',
        fieldType: 'SWITCH',
        name: 'field_switch',
        initialValue: false,
      },
      {
        key: 'FORMNAME_FIELD_field_date',
        variant: 'FIELD',
        fieldType: 'DATE',
        valueType: 'DATE',
        name: 'field_date',
        initialValue: '2023-01-20T07:46:34.558Z',
        meta: {
          format: 'DD/MM/YYYY',
          view: ['month', 'year'],
        },
      },
      {
        key: 'FORMNAME_FIELD_field_daterange',
        variant: 'FIELD',
        fieldType: 'DATERANGE',
        valueType: 'DATE',
        name: 'field_daterange',
        initialValue: {
          start: '',
          end: '',
        },
        meta: {
          format: 'DD/MM/YYYY',
          view: ['month', 'year'],
        },
      },
      {
        key: 'FORMNAME_FIELD_field_file',
        variant: 'FIELD',
        fieldType: 'FILE',
        name: 'field_file',
        initialValue: [],
        meta: {
          description: 'Desc',
          maxSize: 20,
          maxFile: 30,
          allowExtension: ['doc', 'doc'],
        },
      },
      {
        key: 'FORMNAME_FIELD_field_custom',
        variant: 'FIELD',
        fieldType: 'CUSTOM',
        name: 'field_custom',
        initialValue: {},
      },
    ],
  });

  form.executeConfig();

  form.setValues({
    arrayobjectfield: [
      {
        field_text_string_1: 'test',
      }, {

      },
    ],
  });

  form.setValue('arrayobjectfield[0].field_text_string_2', 'test 123');

  expect(form.props).toEqual({
    show: {
      'arrayobjectfield[0].field_text_string_2': true,
      'arrayobjectfield[1].field_text_string_2': false,
      field_text_number: false,
      field_textarea_string: false,
      field_wyswyg_string: false,
    },
    editable: { field_text_number: false },
  });

  expect(form.fields).toEqual({
    error: {
      'arrayobjectfield[1].field_text_string_1': 'Harus Terisi',
      field_text_string: 'Harus Terisi',
    },
    touched: {
      'arrayobjectfield[0].field_text_string_2': true,
    },
  });
});
