// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { hash } from '../src/hash.js';

describe('hash', () => {
  it('should return the correct value', () => {
    const string = 'foo';

    expect(hash(string)).toBe(794144147649);
  });
});
