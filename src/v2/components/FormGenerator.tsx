/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-use-before-define */
/* eslint-disable react/require-default-props */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-key */
import { Suspense, useContext } from "react";
import { ISchema, ISchemaCore } from "../types";
import ComponentContext from "../contexts/ComponentContext";
import { getSchemaKey, getSchemaName } from "../logic/createForm";
import set from "../utils/set";
import { FormContext } from "../contexts";

const updateSchemaConfigName = (schema: ISchemaCore, key: string): any => {
  if (!key) return schema;

  set(schema, "config.name", key);
  return schema;
};

const updateSchemasAttributTitle = (schemas: ISchema[], index: any) => schemas.map((schema) => {
  const overrideSchema = { ...schema };
  if (overrideSchema?.attribute?.title) {
    overrideSchema.attribute = {
      ...overrideSchema.attribute,
      title: overrideSchema.attribute.title.replace("__ITEM__", `${+index + 1}`),
    };
  }

  return overrideSchema;
});

export function SchemaComponent({
  schemas,
  schema,
  parent,
  fallback,
  fallbackVariantNotRegistered,
  fallbackComponentNotRegisterd,
}: {
  schemas: ISchema[];
  schema: ISchemaCore;
  parent: string;
  fallback?: any;
  fallbackVariantNotRegistered?: any;
  fallbackComponentNotRegisterd?: any;
}) {
  const { components } = useContext(ComponentContext);
  const identity = getSchemaName(schema as any, parent);

  if (schema.variant === "FIELD") {
    const Component = components[schema.variant][schema.component];
    if (!Component) return fallbackComponentNotRegisterd;

    return (
      <Suspense fallback={fallback}>
        <Component
          schema={updateSchemaConfigName(schema, identity)}
        />
      </Suspense>
    );
  }

  if (schema.variant === "VIEW") {
    const Component = components[schema.variant][schema.component];
    if (!Component) return fallbackComponentNotRegisterd;

    return (
      <Suspense fallback={fallback}>
        <Component
          schema={updateSchemaConfigName(schema, identity)}
        />
      </Suspense>
    );
  }

  if (schema.variant === "GROUP") {
    const Component = components[schema.variant][schema.component];
    if (!Component) return fallbackComponentNotRegisterd;

    return (
      <Suspense fallback={fallback}>
        <Component
          schema={schema}
          schemas={schemas}
        >
          <FormGenerator
            parent={parent}
            schemas={schemas}
            fallback={fallback}
            fallbackComponentNotRegisterd={fallbackComponentNotRegisterd}
            fallbackVariantNotRegistered={fallbackVariantNotRegistered}
          />
        </Component>
      </Suspense>
    );
  }

  if (schema.variant === "FIELD-ARRAY") {
    const Component = components[schema.variant][schema.component];
    if (!Component) return fallbackComponentNotRegisterd;

    return (
      <Suspense fallback={fallback}>
        <Component
          schema={schema}
          schemas={schemas}
        >
          {({ value, container: Container }) => value.map((data: any, index: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <Container data={data} key={`${identity}-${index}`}>
              <FormGenerator
                parent={`${identity}.${index}`}
                schemas={updateSchemasAttributTitle(schemas, index)}
                fallback={fallback}
                fallbackComponentNotRegisterd={fallbackComponentNotRegisterd}
                fallbackVariantNotRegistered={fallbackVariantNotRegistered}
              />
            </Container>
          ))}
        </Component>
      </Suspense>
    );
  }

  if (schema.variant === "FIELD-OBJECT") {
    const Component = components[schema.variant][schema.component];
    if (!Component) return fallbackComponentNotRegisterd;

    return (
      <Suspense fallback={fallback}>
        <Component
          schema={schema}
          schemas={schemas}
        >
          {({ value, container: Container }) => (
            <Container data={value} key={`${identity}`}>
              <FormGenerator
                parent={`${identity}`}
                schemas={schemas}
                fallback={fallback}
                fallbackComponentNotRegisterd={fallbackComponentNotRegisterd}
                fallbackVariantNotRegistered={fallbackVariantNotRegistered}
              />
            </Container>
          )}
        </Component>
      </Suspense>
    );
  }

  return fallbackVariantNotRegistered;
}

export function FormGenerator(props: {
  schemas?: any[];
  parent?: string;
  fallback?: any;
  fallbackVariantNotRegistered?: any;
  fallbackComponentNotRegisterd?: any;
}) {
  const { form: formContext } = useContext(FormContext);
  const {
    schemas = formContext.config.schemas,
    parent = "",
    fallback = <></>,
    fallbackVariantNotRegistered = <></>,
    fallbackComponentNotRegisterd = <></>,
  } = props;

  return (
    <>
      {(schemas as ISchema[]).map((schema) => {
        const identity = getSchemaKey(schema, parent);
        return (
          <SchemaComponent
            key={identity}
            parent={parent}
            schema={schema}
            schemas={schemas}
            fallback={fallback}
            fallbackComponentNotRegisterd={fallbackComponentNotRegisterd}
            fallbackVariantNotRegistered={fallbackVariantNotRegistered}
          />
        );
      })}
    </>
  );
}

export default FormGenerator;