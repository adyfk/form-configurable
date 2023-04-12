/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-use-before-define */
/* eslint-disable react/require-default-props */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-key */
import { Fragment, Suspense, useContext, useMemo } from "react";
import { ISchema, ISchemaCore } from "../types";
import ComponentContext from "../contexts/ComponentContext";
import { getSchemaName } from "../logic/createForm";
import set from "../utils/set";
import { FormContext } from "../contexts";
import generateId from "../utils/generateId";

interface IFormGeneratorProps {
  schemas: any[];
  parent: string;
  fallback: any;
  fallbackVariantNotRegistered: any;
  fallbackComponentNotRegisterd: any;
  wrapper?: any;
}

interface ISchemaComponentProps extends Omit<IFormGeneratorProps, "schemas"> {
  schema: ISchema;
}

const updateSchemaConfigName = (schema: ISchemaCore, key: string): any => {
  if (!key) return schema;
  const overrideSchema = { ...schema, config: { ...schema.config } };
  set(overrideSchema, "config.name", key);
  return overrideSchema;
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
  wrapper,
  schema,
  parent,
  fallback,
  fallbackVariantNotRegistered,
  fallbackComponentNotRegisterd,
}: ISchemaComponentProps) {
  const { components } = useContext(ComponentContext);
  const identity = getSchemaName(schema as any, parent);
  const generatedKey = useMemo(() => generateId(), []);

  if (schema.variant === "FIELD") {
    const Component = components[schema.variant][schema.component];
    if (!Component) return fallbackComponentNotRegisterd;

    return (
      <Suspense fallback={fallback}>
        <Component
          wrapper={wrapper}
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
          wrapper={wrapper}
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
          wrapper={wrapper}
          schema={schema}
        >
          <FormGenerator
            parent={parent}
            schemas={schema.childs}
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
          wrapper={wrapper}
          schema={schema}
        >
          {({ value, container: Container }, indexContainer) => (
            <Fragment key={indexContainer}>
              {value?.map((data: any, indexValue: number) => (
                <Container
                  index={indexValue}
                  schema={schema}
                  data={data}
                  key={`${parent}-${identity}-${indexContainer}-${indexValue}-${generatedKey}`}
                >
                  <FormGenerator
                    parent={`${identity}.${indexValue}`}
                    schemas={updateSchemasAttributTitle(schema.childs, indexValue)}
                    fallback={fallback}
                    fallbackComponentNotRegisterd={fallbackComponentNotRegisterd}
                    fallbackVariantNotRegistered={fallbackVariantNotRegistered}
                  />
                </Container>
              ))}
            </Fragment>
          )}
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
          wrapper={wrapper}
          schema={schema}
        >
          {({ value, container: Container }, indexValue) => (
            <Container
              index={indexValue}
              schema={schema}
              data={value}
              key={`${identity}`}
            >
              <FormGenerator
                parent={`${identity}`}
                schemas={schema.childs}
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

export function FormGenerator(props: Partial<IFormGeneratorProps>) {
  const { form: formContext } = useContext(FormContext);
  const {
    schemas = formContext.config.schemas,
    parent = "",
    fallback = <></>,
    wrapper = ({ children }: any) => <>{children}</>,
    fallbackVariantNotRegistered = <></>,
    fallbackComponentNotRegisterd = <></>,
  } = props;

  const generatedKey = useMemo(() => generateId(), []);

  return (
    <>
      {(schemas as ISchema[]).map((schema) => {
        const key = schema.variant + schema.component + (schema.config.name || "") + (schema.key || "") + parent + generatedKey;
        return (
          <SchemaComponent
            key={key}
            wrapper={wrapper}
            parent={parent}
            schema={schema}
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