import { describe, expect, it } from 'vitest';
import { imulFallback } from '../src/fold.js';
import { hash } from '../src/index.js';

const BITS = 53;

function bitsOf(value: number): number[] {
  const bits = new Array<number>(BITS);

  let remaining = value;

  for (let index = 0; index < BITS; ++index) {
    bits[index] = remaining % 2;
    remaining = Math.floor(remaining / 2);
  }

  return bits;
}

/**
 * The proportion of trials in which each output bit changes when the input
 * changes by one bit. A bit that never flips, or always flips, carries no
 * information about the difference and shrinks the usable output space.
 */
function avalanche(build: (iteration: number) => [unknown, unknown], trials: number): number[] {
  const flips = new Array(BITS).fill(0) as number[];

  for (let trial = 0; trial < trials; ++trial) {
    const [first, second] = build(trial);
    const firstBits = bitsOf(hash(first));
    const secondBits = bitsOf(hash(second));

    for (let index = 0; index < BITS; ++index) {
      if (firstBits[index] !== secondBits[index]) {
        ++flips[index]!;
      }
    }
  }

  return flips.map((count) => count / trials);
}

const TRIALS = 20000;

describe('output range', () => {
  it('should produce a non-negative safe integer', () => {
    const values: unknown[] = [
      0,
      'string',
      { a: 1 },
      [1, 2, 3],
      new Set([1]),
      new Map([['a', 1]]),
      new Uint8Array([1, 2]),
      null,
    ];

    values.forEach((value) => {
      const result = hash(value);

      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
    });
  });
});

describe('bit distribution', () => {
  // A frozen bit reads as 0 or 1 here; the bound is loose enough that ordinary
  // sampling noise cannot trip it.
  const LOWER = 0.4;
  const UPPER = 0.6;

  it.each([
    ['a top-level number', (iteration: number): [unknown, unknown] => [iteration, iteration ^ 1]],
    ['a top-level string', (iteration: number): [unknown, unknown] => ['id-' + iteration, 'id-' + (iteration ^ 1)]],
    [
      'a value nested in an object',
      (iteration: number): [unknown, unknown] => [
        { a: [1, { b: 'v' + iteration }] },
        { a: [1, { b: 'v' + (iteration ^ 1) }] },
      ],
    ],
    [
      'a key in an object',
      (iteration: number): [unknown, unknown] => [{ ['k' + iteration]: 1 }, { ['k' + (iteration ^ 1)]: 1 }],
    ],
    [
      'a member of a Set',
      (iteration: number): [unknown, unknown] => [new Set(['m' + iteration]), new Set(['m' + (iteration ^ 1)])],
    ],
    [
      'a byte of a typed array',
      (iteration: number): [unknown, unknown] => [new Uint32Array([iteration]), new Uint32Array([iteration ^ 1])],
    ],
  ])('should flip every output bit about half the time for a one-bit change to %s', (_label, build) => {
    const rates = avalanche(build, TRIALS);

    rates.forEach((rate, index) => {
      expect(rate, 'bit ' + index.toString()).toBeGreaterThan(LOWER);
      expect(rate, 'bit ' + index.toString()).toBeLessThan(UPPER);
    });
  });
});

describe('collision resistance', () => {
  const SAMPLES = 200000;

  it.each([
    ['integers', (iteration: number) => iteration],
    ['strings', (iteration: number) => 'value-' + iteration],
    ['flat objects', (iteration: number) => ({ id: iteration, name: 'n' + iteration })],
    ['nested structures', (iteration: number) => [iteration, ['s' + iteration, [iteration % 7]]]],
    ['sets', (iteration: number) => new Set([iteration, 'x' + iteration])],
    [
      'maps',
      (iteration: number) =>
        new Map<string, unknown>([
          ['k', iteration],
          ['j', 's' + iteration],
        ]),
    ],
    ['typed arrays', (iteration: number) => new Uint32Array([iteration, iteration >>> 3])],
    ['non-integer numbers', (iteration: number) => iteration + 0.5],
  ])('should not collide across %s that differ by construction', (_label, build) => {
    const hashes = new Set<number>();

    for (let iteration = 0; iteration < SAMPLES; ++iteration) {
      hashes.add(hash(build(iteration)));
    }

    // Across a 53-bit space, this many values are expected to produce well
    // under one collision by chance, so any duplicate is a structural defect.
    expect(hashes.size).toBe(SAMPLES);
  });

  it('should not collide across every structure of three or fewer nodes', () => {
    const leaves: unknown[] = [0, 1, 'a', 'b', '', true, false, null, undefined, 'a,sb', '|'];
    const keys = ['x', 'y', 'a', '0', '1'];

    function* enumerate(budget: number): Generator {
      yield* leaves;

      if (budget <= 1) {
        return;
      }

      const children = [...enumerate(budget - 1)];

      yield [];
      yield {};
      yield new Set();
      yield new Map();

      for (const child of children) {
        yield [child];
        yield new Set([child]);

        for (const key of keys) {
          yield { [key]: child };
        }

        for (const key of keys.slice(0, 2)) {
          yield new Map([[key, child]]);
        }
      }

      if (budget >= 3) {
        for (const first of children) {
          for (const second of children) {
            yield [first, second];
          }
        }

        for (let index = 0; index < keys.length; ++index) {
          for (let other = index + 1; other < keys.length; ++other) {
            for (const child of children) {
              yield { [keys[index]!]: child, [keys[other]!]: child };
            }
          }
        }
      }
    }

    const hashes = new Set<number>();

    let total = 0;

    for (const value of enumerate(3)) {
      ++total;
      hashes.add(hash(value));
    }

    expect(total).toBeGreaterThan(15000);
    expect(hashes.size).toBe(total);
  });
});

describe('binary equality semantics', () => {
  it('should hash a view by its window rather than its underlying buffer', () => {
    const buffer = new Uint8Array([1, 2, 3, 4]).buffer;

    expect(hash(new DataView(buffer, 0, 2))).not.toBe(hash(new DataView(buffer, 2, 2)));
  });

  it('should hash views of equal content identically regardless of alignment', () => {
    const aligned = new DataView(new Uint8Array([1, 2]).buffer);
    const offset = new DataView(new Uint8Array([9, 1, 2]).buffer, 1, 2);

    expect(hash(aligned)).toBe(hash(offset));
  });

  it('should distinguish typed array classes over identical bytes', () => {
    const bytes = [1, 0, 0, 0, 2, 0, 0, 0];

    expect(hash(new Uint8Array(bytes))).not.toBe(hash(new Uint32Array(new Uint8Array(bytes).buffer)));
  });

  it('should treat signed zero and NaN payloads as SameValueZero does', () => {
    expect(hash(new Float64Array([0]))).toBe(hash(new Float64Array([-0])));
    expect(hash(0)).toBe(hash(-0));
    expect(hash(NaN)).toBe(hash(NaN));
    expect(hash([NaN, -0])).toBe(hash([NaN, 0]));
  });

  it('should distinguish contents that differ only past the packed word boundary', () => {
    const first = new Uint8Array([1, 2, 3, 4, 5]);
    const second = new Uint8Array([1, 2, 3, 4, 6]);

    expect(hash(first)).not.toBe(hash(second));
  });

  it('should distinguish a trailing zero byte from a shorter buffer', () => {
    expect(hash(new Uint8Array([1, 2, 3, 4, 0]))).not.toBe(hash(new Uint8Array([1, 2, 3, 4])));
  });
});

describe('re-entrancy', () => {
  // A fold can reach user code mid-walk - a getter, a Proxy trap, a
  // `Symbol.toStringTag` getter, a custom `toString` - and that code is free to
  // call `hash` again. Each call folds against its own state, so a nested call
  // cannot observe or overwrite the accumulators of the walk it interrupted.
  const withGetter = (value: number) => ({
    get a() {
      hash({ decoy: Math.random() });

      return value;
    },
    b: 2,
  });

  it('should be unaffected by a getter that calls hash', () => {
    expect(hash(withGetter(1))).toBe(hash(withGetter(1)));
    expect(hash(withGetter(1))).not.toBe(hash(withGetter(2)));
  });

  it('should hash a re-entrant getter the same as the plain value it returns', () => {
    expect(hash(withGetter(1))).toBe(hash({ a: 1, b: 2 }));
  });

  it('should be unaffected by Proxy traps that call hash', () => {
    const proxied = (value: number) =>
      new Proxy(
        { a: value, b: 2 },
        {
          ownKeys(target) {
            hash({ decoy: 1 });

            return Reflect.ownKeys(target);
          },
          get(target, key) {
            hash({ decoy: 2 });

            return Reflect.get(target, key);
          },
        },
      );

    expect(hash(proxied(1))).toBe(hash(proxied(1)));
    expect(hash(proxied(1))).not.toBe(hash(proxied(2)));
  });

  it('should be unaffected by a Symbol.toStringTag getter that calls hash', () => {
    const tagged = (value: number) => ({
      a: value,
      get [Symbol.toStringTag]() {
        hash({ decoy: 3 });

        return 'Weird';
      },
    });

    expect(hash(tagged(1))).toBe(hash(tagged(1)));
    expect(hash(tagged(1))).not.toBe(hash(tagged(2)));
  });

  it('should be unaffected by a re-entrant custom toString on a function', () => {
    const build = (value: number) => {
      const fn = () => value;

      fn.toString = () => {
        hash({ decoy: 4 });

        return 'fn' + value.toString();
      };

      return fn;
    };

    expect(hash(build(1))).toBe(hash(build(1)));
    expect(hash(build(1))).not.toBe(hash(build(2)));
  });

  it('should be unaffected by re-entry from inside a Set, where ordering depends on member hashes', () => {
    const build = (value: number) => new Set([withGetter(value), 'x']);

    expect(hash(build(1))).toBe(hash(build(1)));
    expect(hash(build(1))).not.toBe(hash(build(2)));
  });

  it('should be unaffected by repeated re-entry during a large walk', () => {
    const value = {
      list: Array.from({ length: 200 }, (_ignored, index) => ({
        get key() {
          hash({ deep: [1, [2, { x: index }]] });

          return index;
        },
      })),
    };

    expect(hash(value)).toBe(hash(value));
  });
});

describe('Math.imul fallback', () => {
  // Every mix in the fold routes through `imul`, which is the native operation
  // where it exists and this otherwise. Proving the two agree on all operands
  // is what makes the choice invisible: no result can depend on which one the
  // environment selected.
  const EDGE_OPERANDS = [
    0, 1, -1, 2, -2, 0xffff, 0x10000, 0x7fffffff, -0x80000000, 2654435761, 1597334677, 2246822507, 3266489909,
    123456789, -987654321,
  ];

  it('should match Math.imul across edge-case operands', () => {
    EDGE_OPERANDS.forEach((first) => {
      EDGE_OPERANDS.forEach((second) => {
        expect(imulFallback(first, second), first.toString() + ' * ' + second.toString()).toBe(
          Math.imul(first, second),
        );
      });
    });
  });

  it('should match Math.imul across the 32-bit operand range', () => {
    // Deterministic, so a failure is reproducible.
    let seed = 0x2545f491;

    const next = () => {
      seed ^= seed << 13;
      seed >>>= 0;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      seed >>>= 0;

      return seed;
    };

    for (let iteration = 0; iteration < 200000; ++iteration) {
      const first = next() | 0;
      const second = next() | 0;

      expect(imulFallback(first, second), first.toString() + ' * ' + second.toString()).toBe(Math.imul(first, second));
    }
  });
});
