
import {
  useForm,
  type ISchema,
  type ISchemaFieldCustom,
  type ISchemaFieldArrayCustom,
} from 'form-configurable/v2'
import { FormGenerator } from 'form-configurable/v2/components';
import { FormContextProvider, createFormContext } from 'form-configurable/v2/contexts';

interface ISchemaFieldCustom1 extends ISchemaFieldCustom<{ test: true }> {
  variant: "FIELD",
  component: "CUSTOM-1",
}

interface ISchemaFieldArrayCustom1 extends ISchemaFieldArrayCustom<{ test: true }> {
  variant: "FIELD-ARRAY",
  component: "CUSTOM-1",
  childs: ISchema<IMergeSchema>[]
}


type IMergeSchema = ISchemaFieldCustom1 | ISchemaFieldArrayCustom1

const schemas: ISchema<IMergeSchema>[] = [
  {
    variant: 'GROUP',
    component: 'DEFAULT',
    childs: [
      {
        variant: 'FIELD',
        component: 'CUSTOM-1',
        config: {
          name: 'group-custom1'
        },
        overrides: [],
        props: [],
        rules: []
      },
    ],
    config: {},
    props: []
  },
  {
    variant: 'FIELD',
    component: 'DEFAULT',
    config: {
      name: 'field-default'
    },
    overrides: [],
    props: [],
    rules: []
  },
  {
    variant: 'FIELD',
    component: 'CUSTOM-1',
    config: {
      name: 'field-custom1'
    },
    overrides: [],
    props: [],
    rules: []
  },
  {
    variant: 'FIELD-ARRAY',
    component: 'DEFAULT',
    config: {
      name: 'field-array-default'
    },
    childs: [
      {
        variant: 'FIELD',
        component: 'DEFAULT',
        config: {
          name: 'field-default'
        },
        overrides: [],
        props: [],
        rules: []
      },
      {
        variant: 'FIELD',
        component: 'CUSTOM-1',
        config: {
          name: 'field-custom1'
        },
        overrides: [],
        props: [],
        rules: []
      },
    ],
    overrides: [],
    props: [],
    rules: []
  },
  {
    variant: 'FIELD-ARRAY',
    component: 'CUSTOM-1',
    config: {
      name: 'field-array-custom1'
    },
    childs: [
      {
        variant: 'FIELD',
        component: 'DEFAULT',
        config: {
          name: 'field-default'
        },
        overrides: [],
        props: [],
        rules: []
      },
      {
        variant: 'FIELD',
        component: 'CUSTOM-1',
        config: {
          name: 'field-custom1'
        },
        overrides: [],
        props: [],
        rules: []
      },
    ],
    overrides: [],
    props: [],
    rules: []
  },
]
const initialValues = {};

const FormContext = createFormContext<IMergeSchema>()

const FormConfigurable = () => {
  const action = useForm<ISchema<IMergeSchema>>({
    schemas,
    initialValues
  })
  return (
    <FormContextProvider
      context={FormContext}
      action={action}
      components={{
        FIELD: {},
        "FIELD-ARRAY": {},
        "FIELD-OBJECT": {},
        GROUP: {},
        VIEW: {}
      }}>
      <FormGenerator />
    </FormContextProvider>

  )
}

export default FormConfigurable


