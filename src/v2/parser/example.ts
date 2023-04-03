export const ExampleTerms = {
  string: "sample",
  longstring: "sample-sample",
  number: 22,
  float: 2.4,
  emptyobject: {},
  emptyArray: [],
  arraystring: ["sample1", "sample2", "sample3"],
  arraynumber: [5, 6, 3, 7, 4, 1],
  arrayobject: [
    {
      string: "sample1",
      number: 55,
      float: 1.4,
      emptyobject: {},
      emptyArray: [],
      arraystring: ["sample1", "sample2", "sample3"],
      arraynumber: [5, 6, 3, 7, 4, 1],
    },
    {
      string: "sample2",
      number: 22,
      float: 2.4,
      emptyobject: {},
      emptyArray: [],
      arraystring: ["sample1", "sample2", "sample3"],
      arraynumber: [5, 6, 3, 7, 4, 1],
    },
  ],
  object: {
    string: "sample",
    longstring: "sample-sample",
    number: 22,
    float: 2.4,
    emptyobject: {},
    emptyArray: [],
    arraystring: ["sample1", "sample2", "sample3"],
    arraynumber: [5, 6, 3, 7, 4, 1],
    arrayobject: [
      {
        string: "sample1",
        number: 55,
        float: 1.4,
        emptyobject: {},
        emptyArray: [],
        arraystring: ["sample1", "sample2", "sample3"],
        arraynumber: [5, 6, 3, 7, 4, 1],
      },
      {
        string: "sample2",
        number: 22,
        float: 2.4,
        emptyobject: {},
        emptyArray: [],
        arraystring: ["sample1", "sample2", "sample3"],
        arraynumber: [5, 6, 3, 7, 4, 1],
      },
    ],
  },
  objectsimple: {
    string: "string",
    number: 2,
  },
};

export const ExampleInfix = {
  "+": {
    description: "Addition",
    expression: "2+3",
    result: 5,
  },
  "-": {
    description: "Subtraction",
    expression: "8-3",
    result: 5,
  },
  "*": {
    description: "Multiplication",
    expression: "2*3",
    result: 6,
  },
  "/": {
    description: "Division",
    expression: "10/2",
    result: 5,
  },
  ",": {
    description: "Arguments array",
    expression: "1,2,3",
    result: [1, 2, 3],
  },
  "%": {
    description: "Modulo",
    expression: "10%3",
    result: 1,
  },
  "=": {
    description: "Equal to",
    expression: "5=5",
    result: true,
  },
  "!=": {
    description: "Not equal to",
    expression: "5!=5",
    result: false,
  },
  "<>": {
    description: "Not equal to",
    expression: "5<>5",
    result: false,
  },
  "~=": {
    description: "Approximately equal to",
    expression: "0.1+0.2~=0.3",
    result: true,
  },
  ">": {
    description: "Greater than",
    expression: "10>5",
    result: true,
  },
  "<": {
    description: "Less than",
    expression: "3<5",
    result: true,
  },
  ">=": {
    description: "Greater than or equal to",
    expression: "5>=5",
    result: true,
  },
  "<=": {
    description: "Less than or equal to",
    expression: "5<=5",
    result: true,
  },
  AND: {
    description: "Logical AND",
    expression: "TRUE AND FALSE",
    result: false,
  },
  OR: {
    description: "Logical OR",
    expression: "TRUE OR FALSE",
    result: true,
  },
  "^": {
    description: "Exponentiation",
    expression: "2^3",
    result: 8,
  },
};

export const ExamplePrefixIsCondition = {
  IS_NUMBER: {
    expression: "IS_NUMBER(5)",
    result: true,
    description: "",
  },
  IS_STRING: {
    expression: "IS_STRING(\"Test\")",
    result: true,
    description: "",
  },
  IS_ARRAY: {
    expression: "IS_ARRAY([1, 2, 3])",
    result: true,
    description: "",
  },
  IS_DICT: {
    expression: "IS_DICT(emptyobject)",
    result: true,
    description: "",
  },
  IS_DATE: {
    expression: "IS_DATE(\"2022-12-31\")",
    result: true,
    description: "",
  },
  IS_EMAIL: {
    expression: "IS_EMAIL(\"test@example.com\")",
    result: true,
    description: "",
  },
  IS_HTML_EMPTY: {
    expression: "IS_HTML_EMPTY(\"<div></div>\")",
    result: true,
    description: "",
  },
};

export const ExamplePrefixDate = {
  DATE_MAX: {
    expression: "DATE_MAX(\"2021-01-01T00:00:00.000Z\",\"2022-01-01T00:00:00.000Z\")",
    result: true,
    description: "",
  },
  DATE_MIN: {
    expression: "DATE_MIN(\"2022-01-01T00:00:00.000Z\",\"2021-01-01T00:00:00.000Z\")",
    result: true,
    description: "",
  },
};

export const ExamplePrefixString = {
  REGEX: {
    expression: "REGEX(\"^a...s$\", \"alias\")",
    result: true,
    description: "REGEX(stringregex,value)",
  },
  REGEX_FLAG: {
    expression: "REGEX_FLAG(\"^a...s$\",\"g\", \"alias\")",
    result: true,
    description: "REGEX_FLAG(stringregex,flagregex,value)",
  },
  UPPER: {
    expression: "UPPER(\"abc\")",
    result: "ABC",
    description: "",
  },
  LOWER: {
    expression: "LOWER(\"ABC\")",
    result: "abc",
    description: "",
  },
};

export const ExamplePrefixNumber = {
  NEG: {
    expression: "NEG(2)",
    result: -2,
    description: "",
  },
  ABS: {
    expression: "ABS(-2)",
    result: 2,
    description: "",
  },
  CEIL: {
    expression: "CEIL(2.5)",
    result: 3,
    description: "",
  },
  FLOOR: {
    expression: "FLOOR(2.5)",
    result: 2,
    description: "",
  },
  ROUND: {
    expression: "ROUND(2.5)",
    result: 3,
    description: "",
  },
  ADD: {
    expression: "ADD(1, 2)",
    result: 3,
    description: "",
  },
  MOD: {
    expression: "MOD(15, 4)",
    result: 3,
    description: "",
  },
  SUB: {
    expression: "SUB(15, 12)",
    result: 3,
    description: "",
  },
  MUL: {
    expression: "MUL(3, 1)",
    result: 3,
    description: "",
  },
  DIV: {
    expression: "DIV(15, 5)",
    result: 3,
    description: "",
  },
};

export const ExampleBoolean = {
  "!": {
    expression: "!FALSE",
    result: true,
    description: "",
  },
};

export const ExamplePrefixArray = {
  INCLUDES: {
    expression: "INCLUDES(5,arraynumber)",
    result: true,
    description: "",
  },
  AVERAGE: {
    expression: "AVERAGE(arraynumber)",
    result: 4.333333333333333,
    description: "",
  },
  SUM: {
    expression: "SUM(arraynumber)",
    result: 26,
    description: "",
  },
  MIN: {
    expression: "MIN(arraynumber)",
    result: 1,
    description: "",
  },
  SORT: {
    expression: "SORT(arraynumber)",
    result: [1, 3, 4, 5, 6, 7],
    description: "",
  },
  REVERSE: {
    expression: "REVERSE(SORT(arraynumber))",
    result: [7, 6, 5, 4, 3, 1],
    description: "",
  },
  INDEX: {
    expression: "INDEX(0, arraystring)",
    result: "sample1",
    description: "",
  },
  LENGTH: {
    expression: "LENGTH(arraystring)",
    result: 3,
    description: "",
  },
  JOIN: {
    expression: "JOIN(\"-\",arraystring)",
    result: "sample1-sample2-sample3",
    description: "",
  },
  SPLIT: {
    expression: "SPLIT(\"-\",longstring)",
    result: ["sample", "sample"],
    description: "",
  },
  CHAR_ARRAY: {
    expression: "CHAR_ARRAY(string)",
    result: ["s", "a", "m", "p", "l", "e"],
    description: "",
  },
  MAP: {
    expression: "MAP(\"IS_STRING\",arraystring)",
    result: [true, true, true],
    description: "",
  },
  MAP_ITEM: {
    expression: "MAP_ITEM(\"string\",arrayobject)",
    result: ["sample1", "sample2"],
    description: "",
  },
  EVERY: {
    expression: "EVERY(TRUE,MAP(\"IS_STRING\",arraystring))",
    result: true,
    description: "",
  },
  EVERY_IS: {
    expression: "EVERY_IS(\"IS_BOOLEAN\",MAP(\"IS_STRING\",arraystring))",
    result: true,
    description: "",
  },
  EVERY_INFIX: {
    expression: "EVERY_INFIX(\">\",10,[4,4,4,4])",
    result: true,
    description: "",
  },
  REDUCE: {
    expression: "REDUCE(\"ADD\",0,[4,4,4,4])",
    result: 16,
    description: "",
  },
  RANGE: {
    expression: "RANGE(0, 10)",
    result: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    description: "",
  },
  CONCAT: {
    expression: "CONCAT([1,2], [3,4])",
    result: [1, 2, 3, 4],
    description: "",
  },
  PUSH: {
    expression: "PUSH(2,[3,4])",
    result: [3, 4, 2],
    description: "",
  },
  FILTER: {
    expression: "FILTER(\"IS_NUMBER\",[3,4,true,\"string\"])",
    result: [3, 4],
    description: "",
  },
};

export const ExamplePrefixObject = {
  GET: {
    expression: "GET(\"string\",object)",
    result: "sample",
    description: "",
  },
  PUT: {
    expression: "GET(\"coba\", PUT(\"coba\",5, object))",
    result: 5,
    description: "",
  },
  DICT: {
    expression: "DICT([\"key1\", \"key2\"], [\"value1\", \"value2\"])",
    result: { key1: "value1", key2: "value2" },
    description: "",
  },
  KEYS: {
    expression: "KEYS(objectsimple)",
    result: ["string", "number"],
    description: "",
  },
  VALUES: {
    expression: "VALUES(objectsimple)",
    result: ["string", 2],
    description: "",
  },
};