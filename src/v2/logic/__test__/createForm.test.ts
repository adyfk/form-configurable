import { ISchema, ISchemaFieldCore } from "../../types";
import createForm from "../createForm";

test("function", () => {
  interface newX extends ISchemaFieldCore {
    variant: "FIELD",
    childs: [];
    component: "XDEFAULT"
  }

  // eslint-disable-next-line no-redeclare
  type NewObject = newX | ISchema;

  const form = createForm<NewObject>({
    initialValues: {},
    schemas: [
      {
        variant: "FIELD",
        component: "DEFAULT",
        rules: [
          { condition: false, expression: "first > 20", message: "error" },
        ],
        config: {
          name: "first",
        },
        props: [],
        overrides: [],
        attribute: {

        },
        initialValue: 123,
      },
      {
        variant: "FIELD",
        component: "DEFAULT",
        config: {
          name: "second",
        },
        rules: [],
        props: [
          { condition: true, expression: "first > 20", name: "show", value: false },
        ],
        overrides: [],
        attribute: {

        },
        initialValue: 555,
      },
      {
        variant: "FIELD-ARRAY",
        component: "DEFAULT",
        config: {
          name: "array",
        },
        rules: [],
        props: [],
        overrides: [],
        attribute: {},
        initialValue: [
          { first: 50 },
        ],
        childs: [
          {
            variant: "FIELD",
            component: "DEFAULT",
            rules: [
              { condition: true, expression: "__SELF__ > 20", message: "error dong" },
            ],
            config: {
              name: "first",
            },
            props: [],
            overrides: [],
            attribute: {},
          },
          {
            variant: "FIELD",
            component: "DEFAULT",
            config: {
              name: "second",
            },
            rules: [],
            props: [],
            overrides: [],
            attribute: {},
          },
        ],
      },
      {
        variant: "FIELD-OBJECT",
        component: "DEFAULT",
        config: {
          name: "object",
        },
        rules: [],
        props: [],
        overrides: [],
        attribute: {},
        initialValue: { first: 50 },
        childs: [
          {
            variant: "FIELD",
            component: "DEFAULT",
            rules: [
              { condition: true, expression: "__SELF__ > 20", message: "error dong" },
            ],
            config: {
              name: "first",
            },
            props: [],
            overrides: [],
            attribute: {},
            initialValue: 123,
          },
          {
            variant: "FIELD",
            component: "DEFAULT",
            config: {
              name: "second",
            },
            rules: [],
            props: [],
            overrides: [],
            attribute: {},
            initialValue: 555,
          },
        ],
      },
    ],
  });
  expect(form.state.values).toEqual({
    first: 123,
    second: 555,
    array: [{ first: 50 }],
    object: { first: 50 },
  });
  expect(form.state.error).toEqual({
    "array.0.first": "error dong",
    "object.first": "error dong",
  });
  expect(form.state.propsState).toEqual({
    editable: {},
    show: { second: false },
  });
});