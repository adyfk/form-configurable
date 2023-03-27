
import {
  type ISchema,
  type ISchemaFieldCustom,
  type ISchemaFieldArrayCustom,
  type ISchemaFieldDefault,
  type ISchemaViewDefault,
  useForm,
  useField,
  useView,
  ISchemaFieldArrayDefault,
  ISchemaGroupDefault,
  ISchemaGroupCustom,
  ISchemaFieldObjectCustom,
  ISchemaFieldObjectDefault
} from 'form-configurable/v2'
import { FormGenerator } from 'form-configurable/v2/components';
import {
  type IComponent,
  type IComponents,
  type IComponentArray,
  type IComponentContainer,
  type IComponentGroup,
  FormContextProvider,
  IComponentObject
} from 'form-configurable/v2/contexts';

interface ISchemaFieldCustom1 extends ISchemaFieldCustom<{ test: true }> {
  variant: "FIELD",
  component: "CUSTOM-1",
}

interface ISchemaFieldArrayCustom1 extends ISchemaFieldArrayCustom<{ test: true }> {
  variant: "FIELD-ARRAY",
  component: "CUSTOM-1",
  childs: ISchema<IMergeSchema>[]
}

interface ISchemaGroupCustom1 extends ISchemaGroupCustom<{}> {
  variant: "GROUP";
  component: "CUSTOM-1";
  childs: ISchema<IMergeSchema>[]
}

interface ISchemaFieldObjectCustom1 extends ISchemaFieldObjectCustom<{}> {
  variant: "FIELD-OBJECT";
  component: "CUSTOM-1";
  childs: ISchema<IMergeSchema>[]
}

type IMergeSchema = ISchemaFieldCustom1 | ISchemaFieldArrayCustom1 | ISchemaGroupCustom1 | ISchemaFieldObjectCustom1;

const schemas: ISchema<IMergeSchema>[] = [
  {
    variant: 'GROUP',
    component: 'DEFAULT',
    childs: [
      {
        variant: 'FIELD',
        component: 'DEFAULT',
        config: {
          name: 'fielddefault'
        },
        initialValue: '',
        overrides: [],
        props: [],
        rules: [],
        attribute: {
          title: "Sample Title"
        }
      },
    ],
    config: {},
    props: [],
  },
  {
    variant: 'GROUP',
    component: 'CUSTOM-1',
    childs: [
      {
        variant: 'FIELD',
        component: 'DEFAULT',
        config: {
          name: 'fielddefault'
        },
        initialValue: '',
        overrides: [],
        props: [
          {
            name: 'hidden',
            expression: 'GET("name", fieldobjectcustom)',
            value: true,
          }
        ],
        rules: [
          {
            expression: "!fielddefault",
            message: "HARUS TERISI"
          }
        ],
        attribute: {
          title: "Sample Title Hidden"
        }
      },
      {
        variant: 'FIELD',
        component: 'DEFAULT',
        config: {
          name: 'fielddefault'
        },
        initialValue: '',
        overrides: [],
        props: [],
        rules: [],
        attribute: {
          title: "Sample Title"
        }
      },
      {
        variant: 'FIELD',
        component: 'DEFAULT',
        config: {
          name: 'fielddefault'
        },
        initialValue: '',
        overrides: [],
        props: [],
        rules: [],
        attribute: {
          title: "Sample Title"
        }
      },
    ],
    config: {},
    props: []
  },
  {
    variant: 'VIEW',
    component: 'DEFAULT',
    config: {
      name: 'fielddefault'
    },
    props: [],
  },
  {
    variant: 'FIELD',
    component: 'DEFAULT',
    config: {
      name: 'fielddefault'
    },
    initialValue: '',
    overrides: [],
    props: [],
    rules: [],
    attribute: {
      title: "COBAIN X"
    }
  },
  {
    variant: 'FIELD',
    component: 'CUSTOM-1',
    config: {
      name: 'fieldcustom'
    },
    overrides: [],
    props: [],
    rules: []
  },
  {
    variant: 'FIELD-ARRAY',
    component: 'DEFAULT',
    config: {
      name: 'fieldarraydefault'
    },
    initialValue: [
      {}
    ],
    childs: [
      {
        variant: 'FIELD',
        component: 'DEFAULT',
        config: {
          name: 'fielddefault'
        },
        overrides: [],
        props: [],
        rules: [],
        attribute: {
          title: "Sample Title __ITEM__"
        }
      },
      {
        variant: 'FIELD',
        component: 'CUSTOM-1',
        config: {
          name: 'fieldcustom'
        },
        overrides: [],
        props: [],
        rules: [],
        attribute: {
          title: "Sample Title __ITEM__"
        }
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
      name: 'fieldarraycustom'
    },
    childs: [
      {
        variant: 'FIELD',
        component: 'DEFAULT',
        config: {
          name: 'fielddefault'
        },
        overrides: [],
        props: [],
        rules: []
      },
      {
        variant: 'FIELD',
        component: 'CUSTOM-1',
        config: {
          name: 'fieldcustom1'
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
    variant: 'FIELD-OBJECT',
    component: 'DEFAULT',
    config: {
      name: 'fieldobjectdefault'
    },
    childs: [
      {
        variant: 'FIELD',
        component: 'DEFAULT',
        config: {
          name: 'fielddefault'
        },
        overrides: [],
        props: [],
        rules: []
      },
      {
        variant: 'FIELD',
        component: 'CUSTOM-1',
        config: {
          name: 'fieldcustom'
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
    variant: 'FIELD-OBJECT',
    component: 'CUSTOM-1',
    config: {
      name: 'fieldobjectcustom'
    },
    overrides: [],
    props: [],
    rules: [],
    childs: []
  },
]

const initialValues = {};

const FieldDefault: IComponent<ISchemaFieldDefault> = (props) => {
  const { state, onChange, onBlur } = useField({
    schema: props.schema,
  })

  if (state.propsState.hidden) return <></>;

  return (
    <div>
      <div>
        {props.schema.attribute?.title}
      </div>
      <input
        disabled={state.propsState.disabled}
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

const FieldCustom1: IComponent<ISchemaFieldCustom1> = (props) => {
  const { state, onChange, onBlur } = useField({
    schema: props.schema,
  })

  if (state.propsState.hidden) return <></>;

  return (
    <div>
      <div>
        {props.schema.attribute?.title}
      </div>
      <input
        disabled={state.propsState.disabled}
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

const ViewDefault: IComponent<ISchemaViewDefault> = (props) => {
  const { state, } = useView({
    schema: props.schema
  })
  return (
    <div >
      {props.schema.attribute?.title}
      view = {state.value}
    </div>
  )
}


const ContainerFieldArrayDefault: IComponentContainer = ({ data, children }) => {
  return <div>
    THIS CONTAINER
    <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
      {children}
    </div>
  </div>
}

const FieldArrayDefault: IComponentArray<ISchemaFieldArrayDefault> = (props) => {
  const { state } = useField({
    schema: props.schema
  })

  return (
    <div>
      FIELD ARRAY DEFAULT {props.schema.config.name}
      {props.children({
        value: state.value || [],
        container: ContainerFieldArrayDefault
      })}
    </div>
  )
}

const GroupDefault: IComponentGroup<ISchemaGroupDefault> = (props) => {
  return (
    <>
      {props.children}
    </>
  )
}

const GroupCustom1: IComponentGroup<ISchemaGroupCustom1> = (props) => {
  return (
    <div style={{ border: '1px solid gray', padding: 10 }}>
      {props.children}
    </div>
  )
}

const FieldObjectDefault: IComponentObject<ISchemaFieldObjectDefault> = (props) => {
  const { state } = useField({
    schema: props.schema
  })

  return (
    <div>
      FIELD ARRAY DEFAULT {props.schema.config.name}
      {props.children({
        value: state.value || [],
        container: ContainerFieldArrayDefault
      })}
    </div>
  )
}

const FieldObjectCustom1: IComponentObject<ISchemaFieldObjectCustom1> = (props) => {
  const { state, onChange } = useField({
    schema: props.schema
  })

  return (
    <div>
      FIELD ARRAY DEFAULT {props.schema.config.name}
      <div>
        <button onClick={() => { onChange({ name: 'Sample1', age: 20 }) }}>SET VALUE</button>
      </div>
      {JSON.stringify(state.value, null, 2)}
    </div>
  )
}

const components: IComponents = {
  FIELD: {
    "DEFAULT": FieldDefault,
    "CUSTOM-1": FieldCustom1
  },
  "FIELD-ARRAY": {
    "DEFAULT": FieldArrayDefault
  },
  "FIELD-OBJECT": {
    "DEFAULT": FieldObjectDefault,
    "CUSTOM-1": FieldObjectCustom1
  },
  GROUP: {
    'DEFAULT': GroupDefault,
    'CUSTOM-1': GroupCustom1
  },
  VIEW: {
    "DEFAULT": ViewDefault
  }
}

const FormConfigurable = () => {
  const action = useForm<ISchema<IMergeSchema>>({
    schemas,
    initialValues
  })

  const onSubmit = (values: any) => {
    console.log(values)
  }

  const onSubmitError = (values: any, errors) => {
    console.log(values, errors)
  }

  const actionParser = () => {
    console.log('action parser')
    try {
      console.log(action.form.state.values)
      console.log(action.form.parse('GET("name", fieldobjectcustom)'))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <FormContextProvider
        value={action}
        components={components}
      >
        <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
          <FormGenerator
            fallback={<div>Loading</div>}
            fallbackComponentNotRegisterd={<div>Component Not Registed</div>}
            fallbackVariantNotRegistered={<div>Variant Not Registered</div>}
          />
        </div>
      </FormContextProvider>
      <button onClick={actionParser}>
        Parse
      </button>
      <button onClick={action.handleSubmit(onSubmit, onSubmitError)}>Sumbit</button>
    </div>
  )
}

export default FormConfigurable


