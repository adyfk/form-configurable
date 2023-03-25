/* eslint-disable no-console */
// import { renderHook } from "@testing-library/react";
import { INativeSchema, ISchemaFieldArrayCustom, ISchemaFieldCustom, ISchemaGroupCustom, ISchemaViewCustom } from "../../types";
import useForm from "../useForm";
import useField from "../useField";
import "@testing-library/jest-dom";
import useView from "../useView";

interface ISchemaFieldCustom1 extends ISchemaFieldCustom<{ test: boolean }> {
  variant: "FIELD",
  component: "CUSTOM 1",
  attribute: {
    title: string;
  }
}
interface ISchemaFieldArrayCustom1 extends ISchemaFieldArrayCustom<{ x: false }> {
  variant: "FIELD-ARRAY",
  component: "CUSTOM 1",
  attribute: {
    title: string;
  };
}

interface ISchemaViewCustom1 extends ISchemaViewCustom<{ p: boolean; }> {
  variant: "VIEW",
  component: "CUSTOM 1"
}

interface ISchemaGroupCustom1 extends ISchemaGroupCustom<{ x: boolean }> {
  variant: "GROUP";
  component: "CUSTOM 1",
}

type ISchema = INativeSchema | ISchemaFieldCustom1 | ISchemaFieldArrayCustom1 | ISchemaViewCustom1 | ISchemaGroupCustom1

declare module "../../types" {
  // eslint-disable-next-line jest/no-export
}

const schemas: ISchema[] = [
  {
    variant: "FIELD",
    component: "CUSTOM 1",
    props: [
      {
        name: "test",
        value: "",
        expression: "",
      },
    ],
    config: {
      name: "test-name-1",
      data: {},
    },
    overrides: [],
    rules: [],
    attribute: {
      title: "TITLE",
    },
  },
  {
    variant: "FIELD-ARRAY",
    component: "CUSTOM 1",
    props: [
      {
        name: "x",
        value: "",
        expression: "",
      },
    ],
    config: {
      name: "test-name-1",
      data: {},
    },
    overrides: [],
    rules: [],
    attribute: {
      title: "TITLE",
    },
    childs: [

    ],
  },
  {
    variant: "VIEW",
    component: "CUSTOM 1",
    config: {},
    props: [
      {
        name: "p", value: "", expression: "",
      },
    ],
  },
  {
    variant: "GROUP",
    component: "CUSTOM 1",
    childs: [],
    config: {},
    props: [],
  },
];

// eslint-disable-next-line no-unused-vars
function testMergeHook() {
  const { form } = useForm<ISchema>({
    schemas,
    initialValues: {},
    extraData: {},
  });

  const field = useField<ISchemaFieldCustom1>({
    form,
    schema: {
      variant: "FIELD",
      component: "CUSTOM 1",
      rules: [],
      config: {
        name: "xxx",
      },
      attribute: {
        title: "sdfsdf",
      },
      overrides: [],
      props: [],
    },
  });

  const view = useView<ISchemaViewCustom1>({
    form,
    schema: {
      variant: "VIEW",
      component: "CUSTOM 1",
      props: [],
      config: {},
    },
  });

  console.log(
    field,
    view,
  );
  return form;
}
// eslint-disable-next-line jest/expect-expect
test("returns logged in user", () => {
  // const { result } = renderHook(() => testMergeHook());
  // console.log("use form", result.current);
});