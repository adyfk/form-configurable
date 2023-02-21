import { init } from 'expressionparser';
import type { ExpressionValue } from 'expressionparser/dist/ExpressionParser';
import formula from './formula_override';

const termVals: {
  // eslint-disable-next-line no-unused-vars
  [key: string]: number | ((...args: any) => any);
} = {
  a: 12,
  b: 9,
  c: -3,
  _TEST: 42,
  xadd: (a, b) => a + b,
  xneg: (x) => -x,
  isEven: (x) => x % 2 === 0,
};

const termTypes: { [key: string]: 'number' | 'function' } = {
  xadd: 'function',
  xneg: 'function',
  isEven: 'function',
};

const parser = init(
  formula,
  (term: any) => {
    if (term in termVals) {
      return termVals[term];
    }
    return term;
  },
  (term: any) => {
    if (term in termTypes) {
      return termTypes[term];
    }
    return term;
  },
);

const calc = (expression: string, terms?: Record<string, ExpressionValue>) => parser.expressionToValue(expression, {
  arrObject: [
    { name: 'adi', age: 20 },
    { name: 'fatk', age: 22 },
  ],
  x: 10,
  y: -20,
  booltrue: true,
  boolfalse: false,
  xstring: 'this is string',
  xdate: new Date().toISOString(),
  xobject: {
    x: 5,
    y: -4,
    booltrue: true,
    boolfalse: false,
    xstring: 'this is obect string',
    xdate: new Date().toISOString(),
    arrstring: ['tfirst', 'tsecond', 'tthird'],
    arrsnumber: [5, 4, 1],
  },
  arrstring: ['first', 'second', 'third'],
  arrsnumber: [5, 4, 1],
  ...terms,
});

describe('Infix Simple Arithmetic', () => {
  it('should result in 0', () => {
    const result = calc('1^1 - ((1 + 1) * 2) / 4');
    expect(result).toBe(0);
  });
});

describe('Infix Modular Arithmetic', () => {
  it('should result in 3', () => {
    const result = calc('15 % 12');
    expect(result).toBe(3);
  });
  it('should result in 4', () => {
    const result = calc('MOD(16, 12)');
    expect(result).toBe(4);
  });
});

describe('External Function', () => {
  it('should result in 2 condition 1', () => {
    const result = calc('xadd(1,1)');
    expect(result).toBe(2);
  });

  it('should result in 2 condition 2', () => {
    const result = calc('xneg(-2)');
    expect(result).toBe(2);
  });

  it('should result in [1, 2]', () => {
    const result = calc('map(xneg, [-1, -2])');
    expect(result).toEqual([1, 2]);
  });
});

describe('Additional Terms', () => {
  it('should result in 3', () => {
    const result = calc('x + y', { x: 1, y: 2 });
    expect(result).toBe(3);
  });

  it('should result in true', () => {
    const result = calc('x = UNDEFINED', { x: undefined } as any);
    expect(result).toBe(true);
  });
});

describe('Simple Boolean Expression', () => {
  it('should result in true', () => {
    const result = calc('1 + 1 = 2');
    expect(result).toBe(true);
  });
  it('should result in false', () => {
    const result = calc('!(1 + 1 = 2)');
    expect(result).toBe(false);
  });
});

describe('Boolean Expression', () => { });

describe('Case Insensitive Expression', () => { });

describe('Terminal', () => {
  it('should result in 42', () => {
    const result = calc('_TEST + 1 - 1');
    expect(result).toBe(42);
  });
});

describe('Grouping', () => {
  it('should raise error', () => {
    expect(() => {
      calc('(TRUE AND FALSE');
    }).toThrow('Mismatched Grouping (unexpected "(")');
  });
  it('should raise error condition 1', () => {
    expect(() => {
      calc(')TRUE AND FALSE');
    }).toThrow('Mismatched Grouping (unexpected closing ")")');
  });
  it('should raise error condition 2', () => {
    expect(() => {
      calc('((TRUE) AND (FALSE)');
    }).toThrow('Mismatched Grouping (unexpected "(")');
  });
  it('should result in false', () => {
    expect(calc('((TRUE) AND (FALSE))')).toBe(false);
  });
});

describe('Calls and Arrays', () => {
  it('test includes array', () => {
    const result = calc('INCLUDES("x",["x",5,6])');
    expect(result).toBe(true);
  });

  it('should result in 5 condition 1', () => {
    const result = calc('AVERAGE([4,5,6])');
    expect(result).toBe(5);
  });

  it('should result in 5 condition 2', () => {
    const result = calc('SUM(SORT(REVERSE([1,2,2])))');
    expect(result).toBe(5);
  });

  it('should result in ABCDEFG"', () => {
    const result = calc('STRING(MAP("UPPER", CHARARRAY("abcdefg\\"")))');
    expect(result).toBe('ABCDEFG"');
  });

  it('should result in [true, false, true]', () => {
    const result = calc('MAP("NOT", [FALSE, TRUE, FALSE])');
    expect(result).toEqual([true, false, true]);
  });

  it('should result in 6', () => {
    const result = calc('REDUCE("ADD", 0, [1, 2, 3])');
    expect(result).toBe(6);
  });

  it('should result in -6', () => {
    const result = calc('REDUCE("SUB", 0, [3, 2, 1])');
    expect(result).toBe(-6);
  });

  it('should result in 25', () => {
    const result = calc('REDUCE("DIV", 100, [2, 2, 1])');
    expect(result).toBe(25);
  });

  it('should result in 4 condition 2', () => {
    const result = calc('REDUCE("MUL", 1, [2, 2, 1])');
    expect(result).toBe(4);
  });

  it('should result in [ 97, 98, 99, 100, 101, 102, 103 ]', () => {
    const result = calc('MAP("CODE", CHARARRAY("abcdefg"))');
    expect(result).toEqual([97, 98, 99, 100, 101, 102, 103]);
  });

  it('should result in 700', () => {
    const result = calc('REDUCE("+", 0, MAP("CODE", CHARARRAY("abcdefg")))');
    expect(result).toBe(700);
  });

  it('should throw error', () => {
    expect(() => {
      calc('REDUCE("_TEST_", 0, [1, 2, 3])');
    }).toThrow('Unknown function: _TEST_');
  });
});

describe('More Functions', () => {
  it('should result in 10', () => {
    const result = calc('IF(7 < 5, 8, 10)');
    expect(result).toBe(10);
  });

  it('should result in 8 condition 1', () => {
    const result = calc('IF(7 > 5, 8, 10)');
    expect(result).toBe(8);
  });

  it('should result in 8 condition 2', () => {
    expect(() => {
      calc('IF(7 > 5, 8)');
    }).toThrow('Incorrect number of arguments. Expected 3');
  });

  it('should result in 10 condition 2', () => {
    const result = calc('LENGTH(RANGE(0, 10))');
    expect(result).toBe(10);
  });

  it("should result in 'A'", () => {
    const result = calc('CHAR(65)');
    expect(result).toBe('A');
  });

  it('should result in 5', () => {
    const result = calc('MIN([5, 6, 7, 8])');
    expect(result).toBe(5);
  });

  it('should result in 5 condition 1', () => {
    const result = calc('MAX([5, 4, 3, 2])');
    expect(result).toBe(5);
  });

  it('should result in 5 condition 2', () => {
    const result = calc('INDEX([5, 4, 3, 2], 0)');
    expect(result).toBe(5);
  });

  it('should result in "a,b"', () => {
    const result = calc('JOIN(",", ["a", "b"])');
    expect(result).toBe('a,b');
  });

  it("should result in ['a', 'b']", () => {
    const result = calc('SPLIT(",", "a,b")');
    expect(result).toEqual(['a', 'b']);
  });
});

describe('Array Functions', () => {
  it('should result in [[1, 2], [3, 4]]', () => {
    const result = calc('ZIP([1, 3], [2, 4])');
    expect(result).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('should result in [1, 3], [2, 4]', () => {
    const result = calc('UNZIP([[1, 2], [3, 4]])');
    expect(result).toEqual([
      [1, 3],
      [2, 4],
    ]);
  });

  it('should result in [42, 69, 54] condition 2', () => {
    const result = calc('CONCAT([42, 69], [54])');
    expect(result).toEqual([42, 69, 54]);
  });

  it('should result in [2,3,4]', () => {
    const result = calc('CONS(2, [3, 4])');
    expect(result).toEqual([2, 3, 4]);
  });

  it('should result in [2,4,6]', () => {
    const result = calc('FILTER(isEven, [1,2,3,4,5,6])');
    expect(result).toEqual([2, 4, 6]);
  });

  it('should result in [0,2,4]', () => {
    const result = calc('TAKEWHILE(isEven, [0,2,4,5,6,7,8])');
    expect(result).toEqual([0, 2, 4]);
  });

  it('should result in [5,6,7,8]', () => {
    const result = calc('DROPWHILE(isEven, [0,2,4,5,6,7,8])');
    expect(result).toEqual([5, 6, 7, 8]);
  });
});

describe('Dictionaries', () => {
  it('should result in 5', () => {
    const result = calc('GET("b", DICT(["a", "b"], [1, 5]))');
    expect(result).toBe(5);
  });

  it('should result in 5 condition 1', () => {
    const result = calc('GET("b", PUT("b", 5, DICT(["a", "b"], [1, 4])))');
    expect(result).toBe(5);
  });

  it('should result in 5 condition 2', () => {
    const result = calc('GET("b", UNZIPDICT([["a", 1], ["b", 5]]))');
    expect(result).toBe(5);
  });

  it('should result in ["a", "b"]', () => {
    const result = calc('KEYS(UNZIPDICT([["b", 1], ["a", 5]]))');
    expect(result).toEqual(['a', 'b']);
  });

  it('should result in [5, 1]', () => {
    const result = calc('VALUES(UNZIPDICT([["b", 1], ["a", 5]]))');
    expect(result).toEqual([5, 1]);
  });
});

describe('Maths', () => {
  it('should be true', () => {
    const result = calc('(1/0) = INFINITY');
    expect(result).toBe(true);
  });

  it('should be -1', () => {
    const result = calc('(-1)');
    expect(result).toBe(-1);
  });

  it('should result in 1 condition 3', () => {
    const result = calc('FLOOR(1.9)');
    expect(result).toBe(1);
  });

  it('should result in 1 condition 4', () => {
    const result = calc('CEIL(0.1)');
    expect(result).toBe(1);
  });

  it('should result in 1 condition 5', () => {
    const result = calc('ROUND(0.6)');
    expect(result).toBe(1);
  });

  it('should result in 1 condition 6', () => {
    const result = calc('ROUND(1.1)');
    expect(result).toBe(1);
  });

  it('should result in -1', () => {
    const result = calc('FLOOR(-0.1)');
    expect(result).toBe(-1);
  });

  it('should result in -1 condition 1', () => {
    const result = calc('CEIL(-1.1)');
    expect(result).toBe(-1);
  });

  it('should result in -1 condition 2', () => {
    const result = calc('ROUND(-0.6)');
    expect(result).toBe(-1);
  });

  it('should result in -1 condition 3', () => {
    const result = calc('ROUND(-1.1)');
    expect(result).toBe(-1);
  });

  it('should be true condition 3', () => {
    const result = calc('0.99999999999999999 + EPSILON > 1');
    expect(result).toBe(true);
  });
});

describe('Exceptions', () => {
  it("should throw 'Expected array'", () => {
    expect(() => {
      calc('sort("ABC")');
    }).toThrow('Expected array, found: string');
  });

  it("should throw 'Expected array or string'", () => {
    expect(() => {
      calc('index(1, 1)');
    }).toThrow('Expected array or string, found: number');
  });

  it("should throw 'Expected char'", () => {
    expect(() => {
      calc('CODE("FOO")');
    }).toThrow('Expected char, found: string');
  });
});

describe('Date', () => {
  it('test date error', () => {
    expect(calc('DATE_MIN("", "")')).toBe(false);
  });

  it('test date min to be false', () => {
    expect(calc('DATE_MIN("2019-11-17", "2020-11-17")')).toBe(false);
  });
  it('test date min to be true', () => {
    expect(calc('DATE_MIN("2020-11-17", "2019-11-17")')).toBe(true);
  });
});

describe('Array Object', () => {
  test('MAP_ITEM get list item of name', () => {
    expect(calc('MAP_ITEM("name", arrObject)')).toEqual(['adi', 'fatk']);
  });
  test('MAP_ITEM get list item of age', () => {
    expect(calc('MAP_ITEM("age", arrObject)')).toEqual([20, 22]);
  });
});

describe('Every Function', () => {
  it('EVERY', () => {
    expect(calc('EVERY(4,[4,4,4,4])')).toBe(true);
    expect(calc('EVERY("1",["1","1"])')).toBe(true);
  });
  it('EVERY_IS', () => {
    expect(calc('EVERY_IS(IS_NUMBER,[4,4,4,4])')).toBe(true);
    expect(calc('EVERY_IS(IS_STRING,["1","1"])')).toBe(true);
  });

  it('EVERY_WHILE', () => {
    expect(calc('EVERY_WHILE(">", 10,[4,4,4,4])')).toBe(true);
  });
});

describe('IS_Test', () => {
  it('IS_NUMBER test', () => {
    expect(calc('IS_NUMBER(5)')).toBe(true);
  });
  it('IS_STRING test', () => {
    expect(calc('IS_STRING("5")')).toBe(true);
  });
  it('IS_ARRAY test', () => {
    expect(calc('IS_ARRAY([1,2,3])')).toBe(true);
  });
  it('IS_DICT test', () => {
    expect(calc('IS_DICT(xobject)')).toBe(true);
  });
  it('IS_DATE test', () => {
    expect(calc(`IS_DATE(${new Date().toISOString()})`)).toBe(true);
  });
  it('IS_EMAIL test', () => {
    expect(calc('IS_EMAIL("ady.fatk@gmail.com")')).toBe(true);
  });
});
