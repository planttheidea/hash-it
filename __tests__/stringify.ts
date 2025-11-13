// @vitest-environment jsdom

import {
  stringifyArrayBufferFallback,
  stringifyArrayBufferModern,
  stringifyArrayBufferNone,
} from '../src/stringify.js';
import { ARRAY_BUFFER, INTEGER_ARRAY } from './__helpers__/values.js';
import { describe, expect, it, vi } from 'vitest';

describe('ArrayBuffer support', () => {
  it('should support modern usage', () => {
    const stringified = 'stringified';
    const toString = vi.fn(() => stringified);

    const fromBuffer = Buffer.from;

    const spy = vi.spyOn(Buffer, 'from').mockImplementation((buffer) => {
      const result = fromBuffer(buffer);

      result.toString = toString;

      return result;
    });

    const result = stringifyArrayBufferModern(ARRAY_BUFFER);

    expect(spy).toHaveBeenCalledWith(ARRAY_BUFFER);

    spy.mockRestore();

    expect(result).toBe(stringified);
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
