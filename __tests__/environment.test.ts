import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The typed-array constructors are selected once when the module is evaluated,
 * so exercising a fallback means stubbing the global away and re-importing.
 * These paths are unreachable in any environment the package is normally run
 * in, which is exactly why they need covering: nothing else would notice them
 * breaking.
 */
async function loadWithout(...globals: string[]) {
  vi.resetModules();

  globals.forEach((name) => {
    vi.stubGlobal(name, undefined);
  });

  return (await import('../src/index.js')).hash;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('without Float64Array', () => {
  let hash: (value: unknown) => number;

  beforeEach(async () => {
    hash = await loadWithout('Float64Array');
  });

  it('should still order Set members independent of insertion', () => {
    const members = Array.from({ length: 500 }, (_ignored, index) => 'm' + index.toString());

    expect(hash(new Set(members))).toBe(hash(new Set([...members].reverse())));
  });

  it('should still order Map entries independent of insertion', () => {
    expect(
      hash(
        new Map([
          ['a', 1],
          ['b', 2],
        ]),
      ),
    ).toBe(
      hash(
        new Map([
          ['b', 2],
          ['a', 1],
        ]),
      ),
    );
  });

  it('should still distinguish differing collections', () => {
    expect(hash(new Set(['a', 'b']))).not.toBe(hash(new Set(['a', 'c'])));
    expect(hash(new Map([['a', 1]]))).not.toBe(hash(new Map([['a', 2]])));
  });

  it('should handle empty and single-member collections', () => {
    expect(hash(new Set())).toBe(hash(new Set()));
    expect(hash(new Set())).not.toBe(hash(new Set([1])));
    expect(hash(new Map())).not.toBe(hash(new Set()));
  });

  it('should preserve SameValueZero for numbers hashed without bit access', () => {
    expect(hash(0)).toBe(hash(-0));
    expect(hash(NaN)).toBe(hash(NaN));
    expect(hash(1.5)).not.toBe(hash(2.5));
    expect(hash(Infinity)).not.toBe(hash(-Infinity));
  });

  it('should not collide across a corpus of collections', () => {
    const hashes = new Set<number>();

    for (let index = 0; index < 10000; ++index) {
      hashes.add(hash(new Set([index, 'x' + index.toString()])));
    }

    expect(hashes.size).toBe(10000);
  });
});

describe('without Uint8Array', () => {
  let hash: (value: unknown) => number;

  beforeEach(async () => {
    hash = await loadWithout('Uint8Array');
  });

  it('should hash binary values without throwing', () => {
    const buffer = new ArrayBuffer(8);

    expect(() => hash(buffer)).not.toThrow();
    expect(hash(buffer)).toBe(hash(buffer));
  });

  it('should still separate binary classes from one another', () => {
    expect(hash(new ArrayBuffer(4))).not.toBe(hash(new Int32Array(1)));
  });

  it('should leave non-binary values unaffected', () => {
    expect(hash({ a: [1, 'x'] })).toBe(hash({ a: [1, 'x'] }));
    expect(hash({ a: 1 })).not.toBe(hash({ a: 2 }));
  });
});

describe('without Math.imul', () => {
  let hash: (value: unknown) => number;

  beforeEach(async () => {
    // `imul` is read off `Math`, so the stub has to replace the method.
    vi.resetModules();
    vi.stubGlobal('Math', { ...Math, imul: undefined });

    hash = (await import('../src/index.js')).hash;
  });

  it('should produce consistent, distinct hashes via the fallback multiply', () => {
    expect(hash({ a: 1, b: 'two' })).toBe(hash({ a: 1, b: 'two' }));
    expect(hash({ a: 1 })).not.toBe(hash({ a: 2 }));
    expect(hash('foo')).not.toBe(hash('bar'));
  });

  it('should still produce a non-negative safe integer', () => {
    [0, 'x', { a: 1 }, [1, 2], new Set([1])].forEach((value) => {
      const result = hash(value);

      expect(Number.isSafeInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  it('should not collide across a corpus', () => {
    const hashes = new Set<number>();

    for (let index = 0; index < 20000; ++index) {
      hashes.add(hash({ id: index, name: 'n' + index.toString() }));
    }

    expect(hashes.size).toBe(20000);
  });

  it('should produce the same hashes the native multiply produces', async () => {
    // The point of the fallback is to be indistinguishable, so compare it
    // against the native path directly rather than only checking that it
    // behaves plausibly on its own.
    vi.unstubAllGlobals();
    vi.resetModules();

    const { hash: native } = await import('../src/index.js');

    const values: unknown[] = [
      0,
      -0,
      NaN,
      1.5,
      'foo',
      'x'.repeat(500),
      { a: 1, b: [2, 3], c: { d: 'four' } },
      [1, 'two', true, null],
      new Set(['a', 'b', 'c']),
      new Map([['k', 'v']]),
      new Uint8Array([1, 2, 3, 4, 5]),
      new Float64Array([1.5, -0, NaN]),
      new Date(0),
      /pattern/gi,
    ];

    const expected = values.map((value) => native(value));

    for (let index = 0; index < 2000; ++index) {
      expected.push(native({ id: index, name: 'n' + index.toString() }));
    }

    expect(values.map((value) => hash(value))).toEqual(expected.slice(0, values.length));

    for (let index = 0; index < 2000; ++index) {
      expect(hash({ id: index, name: 'n' + index.toString() })).toBe(expected[values.length + index]);
    }
  });
});
