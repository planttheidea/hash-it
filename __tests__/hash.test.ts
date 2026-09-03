// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { hash } from '../src/hash.js';

describe('hash', () => {
  it('should return the correct value', () => {
    const string = 'foo';

    expect(hash(string)).toBe(8339401104290811);
  });

  it('should always produce a safe, non-negative integer', () => {
    const strings = ['', 'a', 'foo', 'x'.repeat(1000), '\u0000\uffff', 'o|26|{2|idn1,4|names5|user1}'];

    strings.forEach((string) => {
      const result = hash(string);

      expect(Number.isSafeInteger(result), string).toBe(true);
      expect(result, string).toBeGreaterThanOrEqual(0);
    });
  });

  it('should not collide across a large corpus of short strings', () => {
    const seen = new Set<number>();

    let collisions = 0;

    for (let index = 0; index < 200000; ++index) {
      const result = hash('s' + index.toString(36));

      if (seen.has(result)) {
        ++collisions;
      }

      seen.add(result);
    }

    expect(collisions).toBe(0);
  });
});
