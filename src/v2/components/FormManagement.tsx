/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-use-before-define */
/* eslint-disable react/require-default-props */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-key */
import { FC, Suspense, useContext, useMemo } from "react";
import { ISchema } from "../types";
import ComponentContext from "../contexts/ComponentContext";
import { getSchemaName } from "../logic/createForm";
import { FormContext } from "../contexts";
import generateId from "../utils/generateId";

interface IFormManagementProps {
  schemas: any[];
  parent: string;
  fallback: any;
  fallbackVariantNotRegistered: any;
  fallbackComponentNotRegisterd: any;
  wrapper: any;
  footer: FC<{
    schemas: any;
    [key: string]: any;
  }>
}

interface ISchemaComponentProps extends Omit<IFormManagementProps, "schemas" | "footer"> {
  schema: ISchema;
}

export function SchemaComponent({
  schema,
  parent,
  fallback,
  fallbackVariantNotRegistered,
  fallbackComponentNotRegisterd,
  wrapper,
}: ISchemaComponentProps) {
  const { components } = useContext(ComponentContext);
  const identity = getSchemaName(schema as any, parent);

  if (schema.variant === "FIELD") {
    const Component = components[schema.variant][schema.component];
    if (!Component) return fallbackComponentNotRegisterd;

    return (
      <Suspense fallback={fallback}>
        <Component
          wrapper={wrapper}
          schema={schema}
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
          schema={schema}
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
          <FormManagement
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
          {({ container: Container }) => (
            <Container schema={schema} data={{}}>
              <FormManagement
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

  if (schema.variant === "FIELD-OBJECT") {
    const Component = components[schema.variant][schema.component];
    if (!Component) return fallbackComponentNotRegisterd;

    return (
      <Suspense fallback={fallback}>
        <Component
          schema={schema}
        >
          {({ value, container: Container }) => (
            <Container schema={schema} data={value} key={`${identity}`}>
              <FormManagement
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

export function FormManagement(props: Partial<IFormManagementProps>) {
  const { form: formContext } = useContext(FormContext);
  const {
    schemas = formContext.config.schemas,
    parent = "",
    fallback = <></>,
    fallbackVariantNotRegistered = <></>,
    fallbackComponentNotRegisterd = <></>,
    footer,
    wrapper,
  } = props;

  const Footer = footer!;
  const generatedKey = useMemo(() => generateId(), []);

  return (
    <>
      {(schemas as ISchema[]).map((schema) => {
        const key = schema.variant + schema.component + (schema.config.name || "") + (schema.key || "") + parent + generatedKey;
        return (
          <SchemaComponent
            key={key}
            parent=""
            wrapper={wrapper}
            schema={schema}
            fallback={fallback}
            fallbackComponentNotRegisterd={fallbackComponentNotRegisterd}
            fallbackVariantNotRegistered={fallbackVariantNotRegistered}
          />
        );
      })}
      <Footer schemas={schemas} />
    </>
  );
}

export default FormManagement;