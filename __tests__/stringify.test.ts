// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import {
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
