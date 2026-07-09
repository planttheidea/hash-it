// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import {
  stringify,
  stringifyArrayBufferFallback,
  stringifyArrayBufferModern,
  stringifyArrayBufferNone,
} from '../src/stringify.js';
import { ARRAY_BUFFER, INTEGER_ARRAY } from './__helpers__/values.js';

describe('ArrayBuffer support', () => {
  it('should support modern usage', () => {
    const result = stringifyArrayBufferModern(ARRAY_BUFFER);

    expect(result).toBe(Buffer.from(ARRAY_BUFFER).toString());
  });

  it('should support fallback usage', () => {
    const stringified = 'stringified';

    const spy = vi.spyOn(String, 'fromCharCode').mockReturnValue(stringified);

    const result = stringifyArrayBufferFallback(ARRAY_BUFFER);

    expect(spy).toHaveBeenCalledWith(...INTEGER_ARRAY);

    spy.mockRestore();

    expect(result).toBe(stringified);
  });

  it('should handle no support', () => {
    const result = stringifyArrayBufferNone();

    expect(result).toBe('UNSUPPORTED');
  });
});

describe('DataView support', () => {
  it('should only hash the bytes within the view window, not the entire underlying buffer', () => {
    const buffer = new Uint8Array([1, 2, 3, 4]).buffer;

    const firstHalf = new DataView(buffer, 0, 2);
    const secondHalf = new DataView(buffer, 2, 2);

    expect(stringify(firstHalf, undefined)).not.toBe(stringify(secondHalf, undefined));
  });

  it('should produce the same hash for two views with the same content but different underlying buffers', () => {
    const viewA = new DataView(new Uint8Array([1, 2]).buffer);
    const viewB = new DataView(new Uint8Array([9, 1, 2]).buffer, 1, 2);

    expect(stringify(viewA, undefined)).toBe(stringify(viewB, undefined));
  });
});
