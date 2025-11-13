// @vitest-environment jsdom

import { hash } from '../src/hash.js';
import { describe, expect, it } from 'vitest';

describe('hash', () => {
  it('should return the correct value', () => {
    const string = 'foo';

    expect(hash(string)).toBe(794144147649);
  });
});
