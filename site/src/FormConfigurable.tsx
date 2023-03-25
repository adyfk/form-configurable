import React from 'react'
import { useForm } from 'form-configurable/v2'
import type { INativeSchema, ISchema } from 'form-configurable/v2'

declare module 'form-configurable/v2' {
  // Redefine the ISchema type
  export type ISchema = INativeSchema | any;
}

const FormConfigurable = () => {
  useForm<ISchema>({
    schemas: [],
    initialValues: {}
  })
  return (
    <div>FormConfigurable</div>
  )
}

export default FormConfigurable


