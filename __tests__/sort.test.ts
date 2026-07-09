import { describe, expect, it } from 'vitest';
import { sortByKey, sortBySelf } from '../src/sort.js';

describe('sortBySelf', () => {
  it('should return -1 when first < second', () => {
    expect(sortBySelf('a', 'b')).toBe(-1);
  });

  it('should return 1 when first > second', () => {
    expect(sortBySelf('b', 'a')).toBe(1);
  });

  it('should return 0 when equal', () => {
    expect(sortBySelf('a', 'a')).toBe(0);
  });

  it('should sort an array via Array.prototype.sort', () => {
    const array = ['banana', 'apple', 'cherry'];

    expect(array.sort(sortBySelf)).toEqual(['apple', 'banana', 'cherry']);
  });
});

describe('sortByKey', () => {
  it('should return -1 when first key < second key', () => {
    expect(sortByKey(['a', 'x'], ['b', 'y'])).toBe(-1);
  });

  it('should return 1 when first key > second key', () => {
    expect(sortByKey(['b', 'x'], ['a', 'y'])).toBe(1);
  });

  it('should return 0 when keys are equal', () => {
    expect(sortByKey(['a', 'x'], ['a', 'y'])).toBe(0);
  });

  it('should sort tuples by their first element via Array.prototype.sort', () => {
    const array: Array<[string, string]> = [
      ['c', '3'],
      ['a', '1'],
      ['b', '2'],
    ];

    expect(array.sort(sortByKey)).toEqual([
      ['a', '1'],
      ['b', '2'],
      ['c', '3'],
    ]);
  });

  it('should preserve relative order of equal keys (stability)', () => {
    const array: Array<[string, string]> = [
      ['a', 'first'],
      ['a', 'second'],
      ['a', 'third'],
    ];

    expect(array.sort(sortByKey)).toEqual([
      ['a', 'first'],
      ['a', 'second'],
      ['a', 'third'],
    ]);
  });
});
