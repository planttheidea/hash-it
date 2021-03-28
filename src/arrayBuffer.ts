const HAS_BUFFER_FROM_SUPPORT =
  typeof Buffer !== 'undefined' && typeof Buffer.from === 'function';
const HAS_UINT16ARRAY_SUPPORT = typeof Uint16Array === 'function';

/**
 * get the string value of the buffer passed based on a Buffer
 *
 * @param buffer the array buffer to convert
 * @returns the stringified buffer
 */
export function getStringifiedArrayBufferFallback(buffer: Buffer): string {
  return String.fromCharCode.apply(null, new Uint16Array(buffer));
}

/**
 * get the string value of the buffer passed based on a Uint16Array
 *
 * @param buffer the array buffer to convert
 * @returns the stringified buffer
 */
export function getStringifiedArrayBufferModern(buffer: Buffer): string {
  return Buffer.from(buffer).toString('utf8');
}

/**
 * return a placeholder when no arraybuffer support exists
 *
 * @returns the placeholder
 */
export function getStringifiedArrayBufferNoSupport() {
  return '';
}

/**
 * @function getStringifiedArrayBuffer
 *
 * @description
 * get the string value of the buffer passed
 *
 * @param {ArrayBuffer} buffer the array buffer to convert
 * @returns {string} the stringified buffer
 */
export const getStringifiedArrayBuffer = (() => {
  if (HAS_BUFFER_FROM_SUPPORT) {
    return getStringifiedArrayBufferModern;
  }

  if (HAS_UINT16ARRAY_SUPPORT) {
    return getStringifiedArrayBufferFallback;
  }

  return getStringifiedArrayBufferNoSupport;
})();
