// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { hash } from '../src/index.js';

describe('typed arrays', () => {
  it('should namespace every typed array class distinctly', () => {
    const classes = [
      Float32Array,
      Float64Array,
      Int8Array,
      Int16Array,
      Int32Array,
      Uint8Array,
      Uint8ClampedArray,
      Uint16Array,
      Uint32Array,
    ];

    const hashes = classes.map((Constructor) => hash(new Constructor([1, 2, 3])));

    expect(new Set(hashes).size).toBe(classes.length);
  });

  it('should not treat a typed array as an ordinary object', () => {
    expect(hash(new Int32Array([1, 2, 3]))).not.toBe(hash({ 0: 1, 1: 2, 2: 3 }));
  });
});

describe('SharedArrayBuffer', () => {
  it('should hash based on its contents', () => {
    const first = new SharedArrayBuffer(8);
    const second = new SharedArrayBuffer(8);

    new Uint8Array(first).set([1, 2, 3, 4, 5, 6, 7, 8]);
    new Uint8Array(second).set([1, 2, 3, 4, 5, 6, 7, 8]);

    expect(hash(first)).toBe(hash(second));

    new Uint8Array(second).set([9], 0);

    expect(hash(first)).not.toBe(hash(second));
  });

  it('should hash based on its byte length', () => {
    expect(hash(new SharedArrayBuffer(8))).not.toBe(hash(new SharedArrayBuffer(64)));
  });

  it('should not collide with an ArrayBuffer of identical contents', () => {
    const shared = new SharedArrayBuffer(4);
    const owned = new ArrayBuffer(4);

    new Uint8Array(shared).set([1, 2, 3, 4]);
    new Uint8Array(owned).set([1, 2, 3, 4]);

    expect(hash(shared)).not.toBe(hash(owned));
  });
});

describe('type namespacing', () => {
  it('should not collide a symbol with the string of its description', () => {
    expect(hash(Symbol('foo'))).not.toBe(hash('Symbol(foo)'));
  });

  it('should hash boxed primitives based on the primitive wrapped', () => {
    expect(hash(Object(BigInt(1)))).toBe(hash(Object(BigInt(1))));
    expect(hash(Object(BigInt(1)))).not.toBe(hash(Object(BigInt(2))));

    const symbol = Symbol('foo');

    expect(hash(Object(symbol))).toBe(hash(Object(symbol)));
    expect(hash(Object(Symbol('foo')))).not.toBe(hash(Object(Symbol('bar'))));
  });

  it('should not collide boxed primitives of different classes', () => {
    const hashes = [
      hash(Object(BigInt(1))),
      hash(Object(Symbol('foo'))),
      hash(Object(1)),
      hash(Object('foo')),
      hash(Object(true)),
      hash(new SharedArrayBuffer(4)),
    ];

    expect(new Set(hashes).size).toBe(hashes.length);
  });
});

describe('separator injection', () => {
  it('should not let array content forge an element boundary', () => {
    expect(hash(['a,sb'])).not.toBe(hash(['a', 'b']));
    expect(hash([['a', 'b']])).not.toBe(hash([['a'], ['b']]));
  });

  it('should not let object values forge an entry boundary', () => {
    expect(hash({ a: 'b,c:sd' })).not.toBe(hash({ a: 'b', c: 'd' }));
  });

  it('should not let object keys forge an entry boundary', () => {
    expect(hash({ 'a:n1,b': 2 })).not.toBe(hash({ a: 1, b: 2 }));
  });

  it('should not let Set content forge a member boundary', () => {
    expect(hash(new Set(['a,sb']))).not.toBe(hash(new Set(['a', 'b'])));
  });

  it('should not let Map content forge an entry boundary', () => {
    expect(hash(new Map([['a', 'b],[sc,sd']]))).not.toBe(
      hash(
        new Map([
          ['a', 'b'],
          ['c', 'd'],
        ]),
      ),
    );
  });

  it('should not let a boxed primitive forge an element boundary', () => {
    expect(hash([new String('a,sb')])).not.toBe(hash([new String('a'), 'b']));
  });

  it('should not let binary content forge an element boundary', () => {
    // 0x2c is `,`, the separator used to join elements
    expect(hash([new Uint8Array([0x2c]).buffer])).not.toBe(
      hash([new Uint8Array([]).buffer, new Uint8Array([]).buffer]),
    );
  });

  it('should still hash equal values equally once delimited', () => {
    expect(hash(['a,sb'])).toBe(hash(['a,sb']));
    expect(hash({ 'a:n1,b': 2 })).toBe(hash({ 'a:n1,b': 2 }));
    expect(hash(new Set(['a,sb']))).toBe(hash(new Set(['a,sb'])));
  });
});

describe('shared references', () => {
  it('should hash a shared reference the same as an equal unshared value', () => {
    const shared = { x: 1 };

    expect(hash({ p: shared, q: shared })).toBe(hash({ p: { x: 1 }, q: { x: 1 } }));
  });

  it('should hash a Map independent of insertion order when entries share references', () => {
    const shared = { x: 1 };

    expect(
      hash(
        new Map<string, unknown>([
          ['x', shared],
          ['y', shared],
        ]),
      ),
    ).toBe(
      hash(
        new Map<string, unknown>([
          ['y', shared],
          ['x', shared],
        ]),
      ),
    );
  });

  it('should hash a Set independent of insertion order when members share references', () => {
    const shared = { x: 1 };

    expect(hash(new Set([{ v: shared }, { w: shared }]))).toBe(hash(new Set([{ w: shared }, { v: shared }])));
  });

  it('should not walk a shared subtree once per reference', () => {
    // Without memoization this is 2^18 traversals and would not complete.
    let deep: any = { leaf: true };

    for (let index = 0; index < 18; ++index) {
      deep = { a: deep, b: deep };
    }

    const start = Date.now();

    expect(hash(deep)).toBe(hash(deep));
    expect(Date.now() - start).toBeLessThan(1000);
  });
});

describe('circular references', () => {
  it('should terminate and stay consistent', () => {
    const circular: any = { name: 'root' };
    circular.self = circular;

    expect(hash(circular)).toBe(hash(circular));
  });

  it('should hash equal circular structures equally', () => {
    const first: any = { name: 'root' };
    first.self = first;

    const second: any = { name: 'root' };
    second.self = second;

    expect(hash(first)).toBe(hash(second));
  });

  it('should distinguish a self-reference from a reference to an equal value', () => {
    const selfReferential: any = { name: 'root' };
    selfReferential.self = selfReferential;

    expect(hash(selfReferential)).not.toBe(hash({ name: 'root', self: { name: 'root' } }));
  });

  it('should hash a Map containing a cycle independent of insertion order', () => {
    const build = (reversed: boolean) => {
      const circular: any = { name: 'root' };
      circular.self = circular;

      const entries: Array<[string, unknown]> = [
        ['a', circular],
        ['b', circular],
      ];

      return new Map(reversed ? entries.reverse() : entries);
    };

    expect(hash(build(false))).toBe(hash(build(true)));
  });
});

describe('iterable objects', () => {
  it('should hash a plain object with a Symbol.iterator by value', () => {
    const build = (value: number) => ({
      v: value,
      [Symbol.iterator]: function* () {
        yield value;
      },
    });

    expect(hash(build(1))).toBe(hash(build(1)));
    expect(hash(build(1))).not.toBe(hash(build(2)));
  });

  it('should hash iterable class instances by value', () => {
    class Bag {
      v: number;

      constructor(v: number) {
        this.v = v;
      }

      *[Symbol.iterator]() {
        yield this.v;
      }
    }

    expect(hash(new Bag(1))).toBe(hash(new Bag(1)));
    expect(hash(new Bag(1))).not.toBe(hash(new Bag(2)));
  });

  it('should still hash generators by reference', () => {
    const build = function* () {
      yield 1;
    };

    const generator = build();

    expect(hash(generator)).toBe(hash(generator));
    expect(hash(build())).not.toBe(hash(build()));
  });
});

describe('order independence (fuzz)', () => {
  // Deterministic PRNG so a failure is reproducible.
  function createRandom(seed: number) {
    let state = seed;

    return () => {
      state = (state * 1103515245 + 12345) & 0x7fffffff;

      return state / 0x7fffffff;
    };
  }

  function buildPool(random: () => number) {
    const leaves: any[] = [{ a: 1 }, { b: 'two' }, [1, 2, 3], { nested: { deep: true } }];
    const pool: any[] = [...leaves];

    // Compose values that reuse the leaves, so shared references appear at
    // multiple depths rather than only at the top level.
    for (let index = 0; index < 6; ++index) {
      const first = leaves[Math.floor(random() * leaves.length)];
      const second = leaves[Math.floor(random() * leaves.length)];

      pool.push({ first, second }, [first, second], new Set([first, second]));
    }

    return pool;
  }

  function shuffle<T>(values: T[], random: () => number) {
    const result = [...values];

    for (let index = result.length - 1; index > 0; --index) {
      const swap = Math.floor(random() * (index + 1));

      [result[index], result[swap]] = [result[swap]!, result[index]!];
    }

    return result;
  }

  it('should hash Maps identically regardless of insertion order', () => {
    for (let seed = 1; seed <= 200; ++seed) {
      const random = createRandom(seed);
      const pool = buildPool(random);

      const entries: Array<[string, unknown]> = Array.from({ length: 6 }, (_, index) => [
        'key' + index,
        pool[Math.floor(random() * pool.length)],
      ]);

      expect(hash(new Map(entries)), 'seed ' + seed.toString()).toBe(hash(new Map(shuffle(entries, random))));
    }
  });

  it('should hash Sets identically regardless of insertion order', () => {
    for (let seed = 1; seed <= 200; ++seed) {
      const random = createRandom(seed);
      const pool = buildPool(random);

      const members = Array.from({ length: 6 }, () => pool[Math.floor(random() * pool.length)]);

      expect(hash(new Set(members)), 'seed ' + seed.toString()).toBe(hash(new Set(shuffle(members, random))));
    }
  });

  it('should hash objects identically regardless of key insertion order', () => {
    for (let seed = 1; seed <= 200; ++seed) {
      const random = createRandom(seed);
      const pool = buildPool(random);

      const entries: Array<[string, unknown]> = Array.from({ length: 6 }, (_, index) => [
        'key' + index,
        pool[Math.floor(random() * pool.length)],
      ]);

      expect(hash(Object.fromEntries(entries)), 'seed ' + seed.toString()).toBe(
        hash(Object.fromEntries(shuffle(entries, random))),
      );
    }
  });
});

describe('array own properties', () => {
  it('should include additional own properties assigned to an array', () => {
    const withProperty: any = [1, 2];
    withProperty.foo = 'bar';

    expect(hash(withProperty)).not.toBe(hash([1, 2]));
  });

  it('should distinguish differing values of an additional own property', () => {
    const first: any = [1, 2];
    first.foo = 'bar';

    const second: any = [1, 2];
    second.foo = 'baz';

    expect(hash(first)).not.toBe(hash(second));
  });

  it('should hash additional own properties independent of assignment order', () => {
    const first: any = [1, 2];
    first.foo = 'a';
    first.bar = 'b';

    const second: any = [1, 2];
    second.bar = 'b';
    second.foo = 'a';

    expect(hash(first)).toBe(hash(second));
  });

  it('should treat equal arrays with equal extra properties as equal', () => {
    const first: any = [1, 2];
    first.foo = 'bar';

    const second: any = [1, 2];
    second.foo = 'bar';

    expect(hash(first)).toBe(hash(second));
  });

  it('should not throw on the intrinsic callee of an arguments object', () => {
    const build = function (..._args: string[]) {
      // eslint-disable-next-line prefer-rest-params
      return arguments;
    };

    expect(() => hash(build('foo', 'bar'))).not.toThrow();
    expect(hash(build('foo', 'bar'))).toBe(hash(build('foo', 'bar')));
    expect(hash(build('foo', 'bar'))).not.toBe(hash(build('foo', 'baz')));
  });

  it('should not confuse an array with an extra property for a longer array', () => {
    const withProperty: any = [1, 2];
    withProperty.foo = 'bar';

    expect(hash(withProperty)).not.toBe(hash([1, 2, 'bar']));
  });
});

describe('non-enumerable own properties', () => {
  function withHidden<Value extends object>(value: Value, hidden: unknown): Value {
    Object.defineProperty(value, 'hidden', { configurable: true, enumerable: false, value: hidden });

    return value;
  }

  it('should include a non-enumerable own property on an array', () => {
    expect(hash(withHidden([1, 2], 'bar'))).not.toBe(hash(withHidden([1, 2], 'baz')));
    expect(hash(withHidden([1, 2], 'bar'))).not.toBe(hash([1, 2]));
    expect(hash(withHidden([1, 2], 'bar'))).toBe(hash(withHidden([1, 2], 'bar')));
  });

  it('should include a non-enumerable own property on a plain object', () => {
    expect(hash(withHidden({ a: 1 }, 'bar'))).not.toBe(hash(withHidden({ a: 1 }, 'baz')));
    expect(hash(withHidden({ a: 1 }, 'bar'))).not.toBe(hash({ a: 1 }));
  });

  it('should not let an unrelated enumerable property decide whether a non-enumerable one counts', () => {
    const build = (hidden: string) => {
      const array: any = withHidden([1, 2], hidden);
      array.visible = 'x';

      return array;
    };

    // the non-enumerable property must matter identically with or without a
    // sibling enumerable one
    expect(hash(build('bar'))).not.toBe(hash(build('baz')));
    expect(hash(withHidden([1, 2], 'bar'))).not.toBe(hash(withHidden([1, 2], 'baz')));
  });

  it('should treat arrays and objects consistently for non-enumerable properties', () => {
    const arrayCounts = hash(withHidden([1, 2], 'bar')) !== hash(withHidden([1, 2], 'baz'));
    const objectCounts = hash(withHidden({ a: 1 }, 'bar')) !== hash(withHidden({ a: 1 }, 'baz'));

    expect(arrayCounts).toBe(objectCounts);
  });

  it('should still not throw on the intrinsic callee of an arguments object', () => {
    const build = function (..._args: string[]) {
      // eslint-disable-next-line prefer-rest-params
      return arguments;
    };

    expect(() => hash(build('foo', 'bar'))).not.toThrow();
    expect(hash(build('foo', 'bar'))).toBe(hash(build('foo', 'bar')));
    expect(hash(build('foo', 'bar'))).not.toBe(hash(build('foo', 'baz')));
  });
});
