
import {
  type ISchema,
  type ISchemaFieldCustom,
  type ISchemaFieldArrayCustom,
  type ISchemaFieldDefault,
  type ISchemaViewDefault,
  useForm,
  useField,
  useView
} from 'form-configurable/v2'
import { FormGenerator } from 'form-configurable/v2/components';
import { Component, Components, FormContextProvider } from 'form-configurable/v2/contexts';

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
    variant: 'VIEW',
    component: 'DEFAULT',
    config: {
      name: 'field-default'
    },
    props: [],
  },
  {
    variant: 'FIELD',
    component: 'DEFAULT',
    config: {
      name: 'field-default'
    },
    initialValue: 12212,
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

const FieldDefault: Component<ISchemaFieldDefault> = (props) => {
  const { state, onChange, onBlur } = useField({
    schema: props.schema,
  })
  return (
    <div>
      <input
        onBlur={onBlur}
        type="text" value={state.value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
      {state.error && <div>Has Error</div>}
    </div>
  )
}

const ViewDefault: Component<ISchemaViewDefault> = (props) => {
  const { state } = useView({
    schema: props.schema
  })
  return (
    <div >
      view = {state.value}
    </div>
  )
}

const components: Components = {
  FIELD: {
    "DEFAULT": FieldDefault,
  },
  "FIELD-ARRAY": {},
  "FIELD-OBJECT": {},
  GROUP: {},
  VIEW: {
    "DEFAULT": ViewDefault
  }
}

const FormConfigurable = () => {
  const action = useForm<ISchema<IMergeSchema>>({
    schemas,
    initialValues
  })
  console.log('container root')
  return (
    <FormContextProvider
      value={action}
      components={components}
    >
      <FormGenerator
        fallback={<div>Loading</div>}
        fallbackComponentNotRegisterd={<div>Component Not Registed</div>}
        fallbackVariantNotRegistered={<div>Variant Not Registered</div>}
      />
    </FormContextProvider>

  )
}

export default FormConfigurable


