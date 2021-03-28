import {
  getStringifiedArrayBufferFallback,
  getStringifiedArrayBufferModern,
  getStringifiedArrayBufferNoSupport,
} from '../src/arrayBuffer';
import { ARRAY_BUFFER, INTEGER_ARRAY } from './__helpers__/values';

describe('ArrayBuffer support', () => {
  it('should support modern usage', () => {
    const stringified = 'stringified';
    const toString = jest.fn(() => stringified);

    const fromBuffer = Buffer.from;

    const spy = jest.spyOn(Buffer, 'from').mockImplementation((buffer) => {
      const result = fromBuffer(buffer);

      result.toString = toString;

      return result;
    });

    const result = getStringifiedArrayBufferModern(ARRAY_BUFFER);

    expect(spy).toHaveBeenCalledWith(ARRAY_BUFFER);

    spy.mockRestore();

    expect(result).toBe(stringified);
  });

  it('should support fallback usage', () => {
    const stringified = 'stringified';

    const spy = jest.spyOn(String, 'fromCharCode').mockReturnValue(stringified);

    const result = getStringifiedArrayBufferFallback(ARRAY_BUFFER);

    expect(spy).toHaveBeenCalledWith(...INTEGER_ARRAY);

    spy.mockRestore();

    expect(result).toBe(stringified);
  });

  it('should handle no support', () => {
    const result = getStringifiedArrayBufferNoSupport(ARRAY_BUFFER);

    expect(result).toBe('');
  });
});
