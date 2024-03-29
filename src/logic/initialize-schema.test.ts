import type { Schema } from "src/types/schema";
import initializeSchema from "./initialize-schema";

const schema: Schema[] = [
  {
    name: "firstName",
    fieldType: "TEXT",
    valueType: "STRING",
    initialValue: "",
    variant: "FIELD",
    rules: [{ error: "FirstName Is Required", expression: "!firstName" }],
  },
  {
    name: "lastName",
    fieldType: "TEXT",
    valueType: "STRING",
    initialValue: "",
    variant: "FIELD",
    rules: [{ error: "LastName Is Required", expression: "!lastName" }],
  },
  {
    variant: "GROUP",
    groupType: "ACCORDION",
    child: [
      {
        name: "age",
        fieldType: "TEXT",
        valueType: "NUMBER",
        variant: "FIELD",
        initialValue: 0,
        rules: [
          { error: "Age Should Higher Than 21", expression: "!(age > 20)" },
        ],
      },
    ],
    meta: {},
  },
];

test("initialize test error field", () => {
  const result = initializeSchema(schema, {
    firstName: "value of firstname",
    lastName: "value of lastname",
    age: 20,
  });

  // eslint-disable-next-line no-console
  expect(result).toEqual([{
    name: "firstName",
    fieldType: "TEXT",
    valueType: "STRING",
    initialValue: "value of firstname",
    variant: "FIELD",
    rules: [{ error: "FirstName Is Required", expression: "!firstName" }],
  }, {
    name: "lastName",
    fieldType: "TEXT",
    valueType: "STRING",
    initialValue: "value of lastname",
    variant: "FIELD",
    rules: [{ error: "LastName Is Required", expression: "!lastName" }],
  }, {
    variant: "GROUP",
    groupType: "ACCORDION",
    child: [{
      name: "age",
      fieldType: "TEXT",
      valueType: "NUMBER",
      variant: "FIELD",
      initialValue: 20,
      rules: [{ error: "Age Should Higher Than 21", expression: "!(age > 20)" }],
    }],
    meta: {},
  }]);
});
