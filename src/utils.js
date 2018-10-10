// external dependencies
import fastStringify from 'fast-stringify';

// constants
import {
  CIRCULAR_VALUE,
  HAS_BUFFER_FROM_SUPPORT,
  HAS_UINT16ARRAY_SUPPORT,
  HTML_ELEMENT_REGEXP,
  ITERABLE_TAGS,
  OBJECT_CLASS_MAP,
  OBJECT_CLASS_TYPE_MAP,
  PRIMITIVE_TAGS,
  SELF_TAGS,
  SVG_ELEMENT_REGEXP,
  TOSTRING_TAGS,
  TYPEDARRAY_TAGS,
  UNPARSEABLE_TAGS,
} from './constants';

const charCodeAt = String.prototype.charCodeAt;
const toString = Object.prototype.toString;
const keys = Object.keys;

/**
 * @function getFunctionName
 *
 * @description
 * get the name of the function based on a series of fallback attempts
 *
 * @param {function} fn the function to test
 * @returns {string} the function name
 */
export const getFunctionName = (fn) =>
  fn.name || (fn.toString().match(/^\s*function\s*([^\(]*)/i) || [])[1] || 'anonymous';

/**
 * @function getCircularValue
 *
 * @description
 * get the value used when circular references are found
 *
 * @returns {string} the value for stringification
 */
export const getCircularValue = () => CIRCULAR_VALUE;

/**
 * @function getIntegerHashValue
 *
 * @description
 * based on string passed, get the integer hash value
 * through bitwise operation (based on spinoff of dbj2
 * with enhancements for reduced collisions)
 *
 * @param {string} string the string to get the hash value for
 * @returns {number} the hash value
 */
export const getIntegerHashValue = (string) => {
  let index = string.length,
      hashA = 5381,
      hashB = 52711,
      charCode;

  while (index--) {
    charCode = charCodeAt.call(string, index);

    hashA = (hashA * 33) ^ charCode;
    hashB = (hashB * 33) ^ charCode;
  }

  return (hashA >>> 0) * 4096 + (hashB >>> 0);
};

/**
 * @function getSortedEvent
 *
 * @description
 * get the event object sorted by its properties
 *
 * @param {boolean} bubbles does the event bubble up through the DOM
 * @param {function} alias to stopPropagation
 * @param {boolean} cancelable is the event cancelable
 * @param {boolean} composed can the event bubble across the boundary to shadow DOM
 * @param {HTMLElement} [currentTarget] registered target for the event
 * @param {boolean} defaultPrevented has preventDefault been called on the event
 * @param {string} eventPhase the phase of the event flow being processed
 * @param {boolean} isTrusted was the event initiated by the browser
 * @param {HTMLElement} [target] the target with which the event was dispatched
 * @param {number} timeStamp the time at which the event was created
 * @param {string} type the name of the event
 * @returns {Object} the event object with all properties sorted
 */
export const getSortedEvent = ({
  bubbles,
  cancelBubble,
  cancelable,
  composed,
  currentTarget,
  defaultPrevented,
  eventPhase,
  isTrusted,
  returnValue,
  target,
  type,
}) => ({
  bubbles,
  cancelBubble,
  cancelable,
  composed,
  currentTarget,
  defaultPrevented,
  eventPhase,
  isTrusted,
  returnValue,
  target,
  type,
});

/**
 * @function shouldSort
 *
 * @description
 * get the sort result based on the two values to compare
 *
 * @param {string} valueA the first value to compare
 * @param {string} valueB the second value to compare
 * @returns {boolean} should the value be sorted
 */
export const shouldSort = (valueA, valueB) => valueA > valueB;

/**
 * @function shouldSortPair
 *
 * @description
 * get the sort result based on the two pairs to compare
 *
 * @param {Object} pairA the first pair to compare
 * @param {Object} pairB the second pair to compare
 * @returns {boolean} should the value be sorted
 */
export const shouldSortPair = (pairA, pairB) => shouldSort(pairA[0], pairB[0]);

/**
 * @function getPrefixedValue
 *
 * @description
 * get the value prefixed by the tag
 *
 * @param {string} tag the object tag
 * @param {any} value the value to stringify
 * @returns {string} the prefixed stringified value
 */
export const getPrefixedValue = (tag, value) => `${tag}|${value}`;

/**
 * @function sort
 *
 * @description
 * sort the array based on the fn passed
 *
 * @param {Array<any>} array the array to sort
 * @param {function} fn the sorting function
 * @returns {Array<any>} the sorted array
 */
export const sort = (array, fn) => {
  let subIndex, value;

  for (let index = 0; index < array.length; index++) {
    value = array[index];

    for (subIndex = index - 1; ~subIndex && fn(array[subIndex], value); subIndex--) {
      array[subIndex + 1] = array[subIndex];
    }

    array[subIndex + 1] = value;
  }

  return array;
};

/**
 * @function getIterablePairs
 *
 * @description
 * get the pairs in the iterable for stringification
 *
 * @param {Map|Set} iterable the iterable to get the pairs for
 * @returns {Array<{key: string, value: any}>} the pairs
 */
export const getSortedIterablePairs = (iterable) => {
  const isMap = typeof iterable.get === 'function';
  const pairs = [];

  iterable.forEach((value, key) => {
    // eslint-disable-next-line no-use-before-define
    pairs.push(isMap ? [stringify(key), stringify(value)] : [stringify(value)]);
  });

  sort(pairs, shouldSortPair);

  const finalPairs = new Array(iterable.size);

  let pair;

  for (let index = 0; index < iterable.size; index++) {
    pair = pairs[index];

    finalPairs[index] = isMap ? `[${pair[0]},${pair[1]}]` : pair[0];
  }

  return getPrefixedValue(getFunctionName(iterable.constructor), `[${finalPairs.join(',')}]`);
};

/**
 * @function getSortedObject
 *
 * @description
 * get the object with the keys sorted
 *
 * @param {Object} object the object to sort
 * @returns {Object} the sorted object
 */
export const getSortedObject = (object) => {
  const objectKeys = sort(keys(object), shouldSort);
  const newObject = {};

  let key;

  for (let index = 0; index < objectKeys.length; index++) {
    key = objectKeys[index];

    newObject[key] = object[key];
  }

  return newObject;
};

/**
 * @function getStringifiedArrayBufferFallback
 *
 * @description
 * get the string value of the buffer passed based on a Buffer
 *
 * @param {ArrayBuffer} buffer the array buffer to convert
 * @returns {string} the stringified buffer
 */
export const getStringifiedArrayBufferFallback = (buffer) => String.fromCharCode.apply(null, new Uint16Array(buffer));

/**
 * @function getStringifiedArrayBufferModern
 *
 * @description
 * get the string value of the buffer passed based on a Uint16Array
 *
 * @param {ArrayBuffer} buffer the array buffer to convert
 * @returns {string} the stringified buffer
 */
export const getStringifiedArrayBufferModern = (buffer) => Buffer.from(buffer).toString('utf8');

/**
 * @function getStringifiedArrayBufferNoSupport
 *
 * @description
 * return a placeholder when no arraybuffer support exists
 *
 * @returns {string} the placeholder
 */
export const getStringifiedArrayBufferNoSupport = () => '';

/**
 * @function getStringifiedArrayBuffer
 *
 * @description
 * get the string value of the buffer passed
 *
 * @param {ArrayBuffer} buffer the array buffer to convert
 * @returns {string} the stringified buffer
 */
export const getStringifiedArrayBuffer = (() =>
  HAS_BUFFER_FROM_SUPPORT
    ? getStringifiedArrayBufferModern
    : HAS_UINT16ARRAY_SUPPORT
      ? getStringifiedArrayBufferFallback
      : getStringifiedArrayBufferNoSupport)();

/**
 * @function getStringifiedDocumentFragment
 *
 * @description
 * build a string based on all the fragment's children
 *
 * @param {DocumentFragment} fragment the fragment to stringify
 * @returns {string} the stringified fragment
 */
export const getStringifiedDocumentFragment = (fragment) => {
  const children = fragment.children;

  let innerHTML = '';

  for (let index = 0; index < children.length; index++) {
    // eslint-disable-next-line no-use-before-define
    innerHTML += children[index].outerHTML;
  }

  return innerHTML;
};

/**
 * @function indexOf
 *
 * @description
 * get the index of the value in the array (faster than native indexOf)
 *
 * @param {Array<any>} array the array to get the index of the value at
 * @param {any} value the value to match
 * @returns {number} the index of the value in array
 */
export const indexOf = (array, value) => {
  for (let index = 0; index < array.length; index++) {
    if (array[index] === value) {
      return index;
    }
  }

  return -1;
};

/**
 * @function getNormalizedValue
 *
 * @description
 * get the value normalized for stringification
 *
 * @param {any} value the value to normalize
 * @param {WeakMap|Object} sortedCache the cache of sorted objects
 * @returns {any} the normalized value
 */
export const getNormalizedValue = (value, sortedCache) => {
  const type = typeof value;

  if (type === 'string') {
    return value;
  }

  if (PRIMITIVE_TAGS[type]) {
    return getPrefixedValue(type, value);
  }

  if (value === null) {
    return getPrefixedValue('null', value);
  }

  const tag = toString.call(value);

  if (SELF_TAGS[tag]) {
    return value;
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.OBJECT) {
    if (~indexOf(sortedCache, value)) {
      return CIRCULAR_VALUE;
    }

    sortedCache.push(value);

    return getSortedObject(value, sortedCache);
  }

  if (TOSTRING_TAGS[tag]) {
    return getPrefixedValue(OBJECT_CLASS_MAP[tag], value.toString());
  }

  if (ITERABLE_TAGS[tag]) {
    if (~indexOf(sortedCache, value)) {
      return CIRCULAR_VALUE;
    }

    sortedCache.push(value);

    return getSortedIterablePairs(value);
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.DATE) {
    return getPrefixedValue(OBJECT_CLASS_MAP[tag], value.getTime());
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.ERROR) {
    return getPrefixedValue(OBJECT_CLASS_MAP[tag], value.stack);
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.EVENT) {
    return getSortedEvent(value);
  }

  if (UNPARSEABLE_TAGS[tag]) {
    return getPrefixedValue(OBJECT_CLASS_MAP[tag], 'NOT_ENUMERABLE');
  }

  if (HTML_ELEMENT_REGEXP.test(tag) || SVG_ELEMENT_REGEXP.test(tag)) {
    return getPrefixedValue(tag.slice(8, -1), value.outerHTML);
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.DOCUMENTFRAGMENT) {
    return getPrefixedValue(OBJECT_CLASS_MAP[tag], getStringifiedDocumentFragment(value));
  }

  if (TYPEDARRAY_TAGS[tag]) {
    return getPrefixedValue(OBJECT_CLASS_MAP[tag], value.join(','));
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.ARRAYBUFFER) {
    return getPrefixedValue(OBJECT_CLASS_MAP[tag], getStringifiedArrayBuffer(value));
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.DATAVIEW) {
    return getPrefixedValue(OBJECT_CLASS_MAP[tag], getStringifiedArrayBuffer(value.buffer));
  }

  return value;
};

/**
 * @function replacer
 *
 * @description
 * create the replacer function used for stringification
 *
 * @param {WeakSet|Object} sortedCache the cache to use for sorting objects
 * @returns {function(key: string, value: any)} function getting the normalized value
 */
export const createReplacer = (sortedCache) => (key, value) => getNormalizedValue(value, sortedCache);

/**
 * @function stringify
 *
 * @description
 * stringify the value based on the options passed
 *
 * @param {any} value the value to stringify
 * @returns {string} the stringified value
 */
export function stringify(value) {
  return typeof value === 'object' && value && !(value instanceof RegExp || value instanceof Date)
    ? fastStringify(value, createReplacer([]), null, getCircularValue)
    : getNormalizedValue(value);
}
