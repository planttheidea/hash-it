import hash from '../src/index';

import { TEST_VALUES } from './__helpers__/values';
import WORDS from './__helpers__/words.json';

const VALUES = TEST_VALUES.map(({ key, value }) => ({ key, value }));
const VALUE_HASHES = VALUES.reduce((map, { key, value }) => {
  map[key] = hash(value);

  return map;
}, {} as Record<string, any>);

const CONSISTENCY_ITERATIONS = 10000;

describe('hash', () => {
  it('should have hashed values that are non-zero', () => {
    VALUES.forEach(({ value }) => {
      expect(hash(value)).not.toBe(0);
    });
  });

  it('should have a unique hash', () => {
    VALUES.forEach(({ value }) => {
      VALUES.forEach(({ value: otherValue }) => {
        if (value !== otherValue) {
          expect(hash(value)).not.toBe(hash(otherValue));
        }
      });
    });
  });

  it('should have a consistent hash', () => {
    TEST_VALUES.forEach(({ key, value }) => {
      for (let index = 0; index < CONSISTENCY_ITERATIONS; ++index) {
        expect(hash(value)).toBe(VALUE_HASHES[key]);
      }
    });
  });

  it(`should not have collisions with ${WORDS.length} integers`, () => {
    const collision: Record<string, string> = {};

    let count = 0;

    WORDS.forEach((word: string, index: number) => {
      const result = hash(index);

      if (collision[result]) {
        count++;
      }

      collision[result] = word;
    });

    expect(count).toBe(0);
  });

  it(`should not have collisions with ${WORDS.length} strings`, () => {
    const collision: Record<string, string> = {};

    let count = 0;

    WORDS.forEach((word: string) => {
      const result = hash(word);

      if (collision[result]) {
        count++;
      }

      collision[result] = word;
    });

    expect(count).toBe(0);
  });

  it('should hash based on a sorted Map', () => {
    const map1 = new Map([
      ['foo', 'bar'],
      ['bar', 'foo'],
    ]);
    const map2 = new Map([
      ['bar', 'foo'],
      ['foo', 'bar'],
    ]);

    expect(hash(map1)).toBe(hash(map2));
  });

  it('should hash based on a sorted Set', () => {
    const set1 = new Set(['foo', 'bar']);
    const set2 = new Set(['bar', 'foo']);

    expect(hash(set1)).toBe(hash(set2));
  });

  describe('hash.is', () => {
    it('should check equality', () => {
      expect(hash.is(undefined, null)).toBe(false);
      expect(hash.is(null, undefined)).toBe(false);

      expect(hash.is(undefined, undefined)).toBe(true);
      expect(hash.is(null, null)).toBe(true);
    });

    describe('hash.is.all', () => {
      it('should check all objects for value equality', () => {
        const equalTest1 = {
          foo: 'bar',
        };
        const equalTest2 = { ...equalTest1 };
        const equalTest3 = { ...equalTest2 };

        const equalTest4 = {
          foo: 'baz',
        };

        expect(equalTest1).not.toBe(equalTest2);
        expect(hash.is.all(equalTest1, equalTest2)).toBe(true);

        expect(equalTest1).not.toBe(equalTest3);
        expect(hash.is.all(equalTest1, equalTest3)).toBe(true);
        expect(hash.is.all(equalTest2, equalTest3)).toBe(true);

        expect(equalTest1).not.toBe(equalTest4);
        expect(hash.is.all(equalTest1, equalTest4)).toBe(false);

        expect(equalTest1).not.toBe(equalTest3);
        expect(hash.is.all(equalTest1, equalTest2, equalTest3)).toBe(true);
        expect(hash.is.all(equalTest1, equalTest2, equalTest4)).toBe(false);
        expect(
          hash.is.all(equalTest1, equalTest2, equalTest3, equalTest4),
        ).toBe(false);
      });
    });

    describe('hash.is.any', () => {
      it('should check any objects for value equality', () => {
        const equalTest1 = {
          foo: 'bar',
        };
        const equalTest2 = { ...equalTest1 };
        const equalTest3 = { ...equalTest2 };

        const equalTest4 = {
          foo: 'baz',
        };

        expect(equalTest1).not.toBe(equalTest2);
        expect(hash.is.any(equalTest1, equalTest2)).toBe(true);

        expect(equalTest1).not.toBe(equalTest3);
        expect(hash.is.any(equalTest1, equalTest3)).toBe(true);
        expect(hash.is.any(equalTest2, equalTest3)).toBe(true);

        expect(equalTest1).not.toBe(equalTest4);
        expect(hash.is.any(equalTest1, equalTest4)).toBe(false);

        expect(equalTest1).not.toBe(equalTest3);
        expect(hash.is.any(equalTest1, equalTest2, equalTest3)).toBe(true);
        expect(hash.is.any(equalTest1, equalTest2, equalTest4)).toBe(true);
        expect(
          hash.is.any(equalTest1, equalTest2, equalTest3, equalTest4),
        ).toBe(true);
        expect(
          hash.is.any(equalTest4, equalTest1, equalTest2, equalTest3),
        ).toBe(false);
      });
    });

    describe('hash.is.not', () => {
      it('should check any objects for value inequality', () => {
        expect(hash.is.not(undefined, null)).toBe(true);
        expect(hash.is.not(null, undefined)).toBe(true);

        expect(hash.is.not(undefined, undefined)).toBe(false);
        expect(hash.is.not(null, null)).toBe(false);
      });
    });

    describe('specific value validation', () => {
      it('should not allow simple string faking to produce false positives', () => {
        expect(hash.is(42, 'number|42')).toBe(false);
        expect(hash.is(null, 'null|null')).toBe(false);
        expect(hash.is(new Date(1970, 0, 1), 'Date|0')).toBe(false);
        expect(hash.is(new Date(1970, 0, 1), '1970-01-01T00:00:00.000Z')).toBe(
          false,
        );
      });

      it('should handle nested dates', () => {
        expect(hash.is(new Date(1970, 0, 1), new Date(1970, 0, 1))).toBe(true);
        expect(
          hash.is(
            { date: new Date(1970, 0, 1) },
            { date: new Date(1970, 0, 1) },
          ),
        ).toBe(true);
        expect(
          hash.is(
            { date: new Date(1970, 0, 1) },
            { date: '1970-01-01T00:00:00.000Z' },
          ),
        ).toBe(false);
      });

      it('should handle recursive values', () => {
        const object: Record<string, any> = {};

        object.self = object;

        expect(hash.is(object, object)).toBe(true);
        expect(hash.is(object, '{"self":"[~.]"}')).toBe(false);

        const array1 = [object, object, object];
        const array2 = [object, object];

        array2.push(array2);

        expect(hash.is(array1, [object, object, object])).toBe(true);
        expect(
          hash.is(
            array1,
            '[{"self":"[~.0]"},{"self":"[~.1]"},{"self":"[~.2]"}]',
          ),
        ).toBe(false);
        expect(hash.is(array1, array2)).toBe(false);
      });
    });
  });
});
