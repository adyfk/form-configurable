import { FieldType, ValueType } from 'gateway/field';
import useForm from '../client/useForm';

const useFormTest = () => {
  const { control, fields, formState, handleSubmit } = useForm({
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
        config: [
          { name: 'hidden', expression: '!firstName' },
          { name: 'disabled', expression: 'firstValue > secondValue' },
        ],
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
        config: [{ name: 'disabled', value: true }],
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
  });

  return {
    control,
    fields,
    formState,
    handleSubmit,
  };
};

export default useFormTest;
