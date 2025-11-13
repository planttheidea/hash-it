// @vitest-environment jsdom

import hash from '../src/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { TEST_VALUES } from './__helpers__/values.js';
import { describe, expect, it } from 'vitest';

const WORDS_PATH = path.resolve('__tests__', '__helpers__', 'words.json');
const WORDS: string[] = JSON.parse(fs.readFileSync(WORDS_PATH, 'utf8'));

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
    VALUES.forEach(({ key, value }) => {
      VALUES.forEach(({ key: otherKey, value: otherValue }) => {
        if (value !== otherValue) {
          expect(
            hash(value),
            `{ key: ${key}, otherKey: ${otherKey} }`,
          ).not.toBe(hash(otherValue));
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

  it('should hash the same non-enumerable references the same, but unique references differently', () => {
    [
      () =>
        (function* foo() {
          yield true;
        })(),
      () => Promise.resolve(),
      () => new WeakMap(),
      () => new WeakSet(),
    ].forEach((getItem) => {
      const item1 = getItem();
      const item2 = getItem();

      expect(hash(item1)).toBe(hash(item1));
      expect(hash(item1)).not.toBe(hash(item2));
    });
  });

  it('should support primitive wrappers', () => {
    [
      [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        async function () {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        async function () {},
        async function () {
          await console.log('foo');
        },
      ],
      [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        async function* () {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        async function* () {},
        async function* () {
          await console.log('foo');
        },
      ],
      [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function () {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function () {},
        function () {
          console.log('foo');
        },
      ],
      [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function* () {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function* () {},
        function* () {
          console.log('foo');
        },
      ],
      [new Boolean(true), new Boolean(true), new Boolean(false)],
      [new Number('123'), new Number('123'), new Number('234')],
      [new String('foo'), new String('foo'), new String('bar')],
    ].forEach(([item, equalItem, unequalItem]) => {
      expect(hash(item)).toBe(hash(equalItem));
      expect(hash(item)).not.toBe(hash(unequalItem));
    });
  });
});
