// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { hash, imulFallback } from '../src/hash.js';

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

describe('Math.imul fallback', () => {
  it('should match Math.imul across the operand range', () => {
    const operands = [
      0, 1, -1, 2, -2, 0xffff, 0x10000, 0x7fffffff, -0x80000000, 2654435761, 1597334677, 123456789, -987654321,
    ];

    operands.forEach((first) => {
      operands.forEach((second) => {
        expect(imulFallback(first, second), first.toString() + ' * ' + second.toString()).toBe(
          Math.imul(first, second),
        );
      });
    });
  });

  it('should produce hashes identical to the native implementation when substituted', () => {
    // Mirrors `hash`, but pinned to the fallback so both paths are exercised
    // regardless of which one the environment selects.
    const hashViaFallback = (string: string) => {
      let index = string.length;
      let hashA = 5381;
      let hashB = 52711;
      let charCode;

      while (index--) {
        charCode = string.charCodeAt(index);

        hashA = imulFallback(hashA ^ charCode, 2654435761);
        hashB = imulFallback(hashB ^ charCode, 1597334677);
      }

      return (hashA >>> 0) * 2097152 + (hashB >>> 11);
    };

    const strings = ['', 'a', 'foo', 'the quick brown fox', 'x'.repeat(1000), '\u0000\uffff\u00e9'];

    strings.forEach((string) => {
      expect(hashViaFallback(string), string).toBe(hash(string));
    });

    for (let index = 0; index < 5000; ++index) {
      const string = 's' + index.toString(36);

      expect(hashViaFallback(string), string).toBe(hash(string));
    }
  });
});
