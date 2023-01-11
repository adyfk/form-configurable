import { init } from 'expressionparser';
import formula from './formula_override';
import type { ExpressionValue } from 'expressionparser/dist/ExpressionParser';

const termVals: { [key: string]: number | ((...args: any) => any) } = {
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
  (term: string) => {
    if (term in termVals) {
      return termVals[term];
    } else {
      throw new Error(`Invalid term: ${term}`);
    }
  },
  (term: string) => {
    if (term in termTypes) {
      return termTypes[term];
    } else {
      return 'number';
    }
  }
);

const calc = (expression: string, terms?: Record<string, ExpressionValue>) => {
  return parser.expressionToValue(expression, {
    ...terms,
    arrObject: [
      { name: 'adi', age: 20 },
      { name: 'fatk', age: 22 },
    ],
  });
};

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

describe('Boolean Expression', () => {});

describe('Case Insensitive Expression', () => {});

describe('Terminal', () => {
  it('should result in 42', () => {
    const result = calc('_TEST + 1 - 1');
    expect(result).toBe(42);
  });

  it('should raise error', () => {
    expect(() => {
      calc('_TEST + _INVALID');
    }).toThrowError('Invalid term');
  });
});

describe('Grouping', () => {
  it('should raise error', () => {
    expect(() => {
      calc('(TRUE AND FALSE');
    }).toThrowError('Mismatched Grouping (unexpected "(")');
  });
  it('should raise error condition 1', () => {
    expect(() => {
      calc(')TRUE AND FALSE');
    }).toThrowError('Mismatched Grouping (unexpected closing ")")');
  });
  it('should raise error condition 2', () => {
    expect(() => {
      calc('((TRUE) AND (FALSE)');
    }).toThrowError('Mismatched Grouping (unexpected "(")');
  });
  it('should result in false', () => {
    expect(calc('((TRUE) AND (FALSE))')).toBe(false);
  });
});

describe('Calls and Arrays', () => {
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
    }).toThrowError('Unknown function: _TEST_');
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
    }).toThrowError('Incorrect number of arguments. Expected 3');
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

  it('should result in [42, 69]', () => {
    const result = calc('TAKE(2, [42, 69, 54])');
    expect(result).toEqual([42, 69]);
  });

  it('should result in [69, 54]', () => {
    const result = calc('DROP(2, [1, 42, 69, 54])');
    expect(result).toEqual([69, 54]);
  });

  it('should result in [42, 69] condition 1', () => {
    const result = calc('SLICE(1, 3, [1, 42, 69, 54])');
    expect(result).toEqual([42, 69]);
  });

  it('should result in [42, 69, 54] condition 2', () => {
    const result = calc('CONCAT([42, 69], [54])');
    expect(result).toEqual([42, 69, 54]);
  });

  it('should result in 42', () => {
    const result = calc('HEAD([42, 69, 54])');
    expect(result).toBe(42);
  });

  it('should result in [69, 54] condition 2', () => {
    const result = calc('TAIL([42, 69, 54])');
    expect(result).toEqual([69, 54]);
  });

  it('should result in 54', () => {
    const result = calc('LAST([42, 69, 54])');
    expect(result).toBe(54);
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
  it('should be false', () => {
    const result = calc('ISNAN(1/0)');
    expect(result).toBe(false);
  });

  it('should be true', () => {
    const result = calc('(1/0) = INFINITY');
    expect(result).toBe(true);
  });

  it('should be false condition 2', () => {
    const result = calc('ISNAN(0)');
    expect(result).toBe(false);
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

  it('should result in 1 condition 7', () => {
    const result = calc('TRUNC(1.9)');
    expect(result).toBe(1);
  });

  it('should result in 1 condition 8', () => {
    const result = calc('SIGN(5)');
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

  it('should result in -1 condition 4', () => {
    const result = calc('TRUNC(-1.9)');
    expect(result).toBe(-1);
  });

  it('should result in -1 condition 5', () => {
    const result = calc('SIGN(-5)');
    expect(result).toBe(-1);
  });

  it('should be true condition 3', () => {
    const result = calc('0.99999999999999999 + EPSILON > 1');
    expect(result).toBe(true);
  });
});

describe('Exceptions', () => {
  it("should throw 'Expected number'", () => {
    expect(() => {
      calc('add("A", "B")');
    }).toThrowError('Expected number, found: string');
  });

  it("should throw 'Expected array'", () => {
    expect(() => {
      calc('sort("ABC")');
    }).toThrowError('Expected array, found: string');
  });

  it("should throw 'Expected array or string'", () => {
    expect(() => {
      calc('index(1, 1)');
    }).toThrowError('Expected array or string, found: number');
  });

  it("should throw 'Expected char'", () => {
    expect(() => {
      calc('CODE("FOO")');
    }).toThrowError('Expected char, found: string');
  });
});

describe('Date', () => {
  it('test date error', () => {
    expect(() => {
      calc('DATE_MIN("", "")');
    }).toThrowError('Expected string or number date format, found: string');
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
