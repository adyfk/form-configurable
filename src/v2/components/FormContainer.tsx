/* eslint-disable no-use-before-define */
/* eslint-disable react/require-default-props */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-key */
import { useContext } from "react";
import { ISchema, ISchemaCore } from "../types";
import ComponentContext from "../contexts/ComponentContext";
import { getSchemaKey, getSchemaName } from "../logic/createForm";
import set from "../utils/set";

function ComponentNotRegistered({ schema }: { schema: ISchemaCore; }) {
  return <div>Component "{schema.component}" not registered</div>;
}

const updateSchemaConfigName = (schema: ISchemaCore, key: string): any => {
  if (!key) return schema;

  set(schema, "config.name", key);
  return schema;
};

function SchemaComponent({
  schemas,
  schema,
  parent,
}: {
  schemas: ISchema[];
  schema: ISchemaCore;
  parent: string;
}) {
  const { components } = useContext(ComponentContext);
  const identity = getSchemaName(schema as any, parent);

  if (schema.variant === "FIELD") {
    const Component = components[schema.variant][schema.component] || ComponentNotRegistered;
    return (
      <Component
        schema={updateSchemaConfigName(schema, identity)}
      />
    );
  }

  if (schema.variant === "VIEW") {
    const Component = components[schema.variant][schema.component] || ComponentNotRegistered;
    return (
      <Component
        schema={updateSchemaConfigName(schema, identity)}
      />
    );
  }

  if (schema.variant === "GROUP") {
    const Component = components[schema.variant][schema.component] || ComponentNotRegistered;
    return (
      <Component
        schema={schema}
        schemas={schemas}
      >
        <FormGenerator
          parent={parent}
          schemas={schemas}
        />
      </Component>
    );
  }

  if (schema.variant === "FIELD-ARRAY") {
    const Component = components[schema.variant][schema.component] || ComponentNotRegistered;
    return (
      <Component
        schema={schema}
        schemas={schemas}
      >
        {({ value, container: Container }) => value.map((data: any, index: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <Container data={data} key={`${identity}-${index}`}>
            <FormGenerator
              parent={`${identity}.${index}`}
              schemas={schemas}
            />
          </Container>
        ))}
      </Component>
    );
  }

  if (schema.variant === "FIELD-OBJECT") {
    const Component = components[schema.variant][schema.component] || ComponentNotRegistered;
    return (
      <Component
        schema={schema}
        schemas={schemas}
      >
        {({ value, container: Container }) => (
          <Container data={value} key={`${identity}`}>
            <FormGenerator
              parent={`${identity}`}
              schemas={schemas}
            />
          </Container>
        )}
      </Component>
    );
  }

  return <div>variant `{schema.variant}` not registered</div>;
}

function FormGenerator({
  schemas,
  parent = "",
}: {
  schemas: any[];
  parent?: string;
}) {
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
          />
        );
      })}
    </>
  );
}

export default FormGenerator;