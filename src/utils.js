// constants
import {
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

const SEPARATOR = '|';

const FUNCTION_NAME_REGEX = /^\s*function\s*([^\(]*)/i;

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
export function getFunctionName(fn) {
  return (
    fn.name
    || (fn.toString().match(FUNCTION_NAME_REGEX) || [])[1]
    || 'anonymous'
  );
}

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
export function getIntegerHashValue(string) {
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
}

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
export function getSortedEvent(event) {
  return {
    bubbles: event.bubbles,
    cancelBubble: event.cancelBubble,
    cancelable: event.cancelable,
    composed: event.composed,
    currentTarget: event.currentTarget,
    defaultPrevented: event.defaultPrevented,
    eventPhase: event.eventPhase,
    isTrusted: event.isTrusted,
    returnValue: event.returnValue,
    target: event.target,
    type: event.type,
  };
}

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
export function shouldSort(valueA, valueB) {
  return valueA > valueB;
}

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
export function shouldSortPair(pairA, pairB) {
  return shouldSort(pairA[0], pairB[0]);
}

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
export function sort(array, fn) {
  let subIndex, value;

  for (let index = 0; index < array.length; index++) {
    value = array[index];

    for (
      subIndex = index - 1;
      ~subIndex && fn(array[subIndex], value);
      subIndex--
    ) {
      array[subIndex + 1] = array[subIndex];
    }

    array[subIndex + 1] = value;
  }

  return array;
}

/**
 * @function getIterablePairs
 *
 * @description
 * get the pairs in the iterable for stringification
 *
 * @param {Map|Set} iterable the iterable to get the pairs for
 * @returns {Array<{key: string, value: any}>} the pairs
 */
export function getSortedIterablePairs(iterable, cache, keys) {
  const isMap = typeof iterable.get === 'function';
  const entries = [];

  if (isMap) {
    iterable.forEach((value, key) => {
      entries.push([
        // eslint-disable-next-line no-use-before-define
        stringify(key, cache, keys),
        // eslint-disable-next-line no-use-before-define
        stringify(value, cache, keys),
      ]);
    });

    sort(entries, shouldSortPair);
  } else {
    iterable.forEach((value) => {
      // eslint-disable-next-line no-use-before-define
      entries.push(stringify(value, cache, keys));
    });

    sort(entries, shouldSort);
  }

  let final = getFunctionName(iterable.constructor) + SEPARATOR + '[';

  for (let index = 0, length = entries.length, entry; index < length; index++) {
    entry = entries[index];

    final += `${index ? ',' : ''}${
      isMap ? `[${entry[0]},${entry[1]}]` : entry
    }`;
  }

  return final + ']';
}

/**
 * @function getSortedObject
 *
 * @description
 * get the object with the keys sorted
 *
 * @param {Object} object the object to sort
 * @returns {Object} the sorted object
 */
export function getSortedObject(object) {
  const objectKeys = sort(keys(object), shouldSort);
  const newObject = {};

  let key;

  for (let index = 0; index < objectKeys.length; index++) {
    key = objectKeys[index];

    newObject[key] = object[key];
  }

  return newObject;
}

/**
 * @function getStringifiedArrayBufferFallback
 *
 * @description
 * get the string value of the buffer passed based on a Buffer
 *
 * @param {ArrayBuffer} buffer the array buffer to convert
 * @returns {string} the stringified buffer
 */
export function getStringifiedArrayBufferFallback(buffer) {
  return String.fromCharCode.apply(null, new Uint16Array(buffer));
}

/**
 * @function getStringifiedArrayBufferModern
 *
 * @description
 * get the string value of the buffer passed based on a Uint16Array
 *
 * @param {ArrayBuffer} buffer the array buffer to convert
 * @returns {string} the stringified buffer
 */
export function getStringifiedArrayBufferModern(buffer) {
  return Buffer.from(buffer).toString('utf8');
}

/**
 * @function getStringifiedArrayBufferNoSupport
 *
 * @description
 * return a placeholder when no arraybuffer support exists
 *
 * @returns {string} the placeholder
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

/**
 * @function getStringifiedDocumentFragment
 *
 * @description
 * build a string based on all the fragment's children
 *
 * @param {DocumentFragment} fragment the fragment to stringify
 * @returns {string} the stringified fragment
 */
export function getStringifiedDocumentFragment(fragment) {
  const children = fragment.children;

  let innerHTML = '';

  for (let index = 0; index < children.length; index++) {
    innerHTML += children[index].outerHTML;
  }

  return innerHTML;
}

/**
 * @function getCutoffIndex
 *
 * @description
 * get the index after that of the value match in the array (faster than
 * native indexOf) to determine the cutoff index for the `splice()` call.
 *
 * @param {Array<any>} array the array to get the index of the value at
 * @param {any} value the value to match
 * @returns {number} the index after the value match in the array
 */
export function getCutoffIndex(array, value) {
  for (let index = 0; index < array.length; index++) {
    if (array[index] === value) {
      return index + 1;
    }
  }

  return 0;
}

/**
 * @function getNormalizedValue
 *
 * @description
 * get the value normalized for stringification
 *
 * @param {any} value the value to normalize
 * @param {WeakMap|Object} sortedCache the cache of sorted objects
 * @param {string} [passedTag] the previously-calculated tag
 * @returns {any} the normalized value
 */
export function getNormalizedValue(value, cache, keys, passedTag) {
  if (passedTag === void 0) {
    const type = typeof value;

    if (type === 'string' || PRIMITIVE_TAGS[type]) {
      return type + SEPARATOR + value;
    }

    if (value === null) {
      return 'null' + SEPARATOR + value;
    }
  }

  const tag = passedTag || toString.call(value);

  if (SELF_TAGS[tag]) {
    return value;
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.OBJECT) {
    return getSortedObject(value);
  }

  if (TOSTRING_TAGS[tag]) {
    return OBJECT_CLASS_MAP[tag] + SEPARATOR + value.toString();
  }

  if (ITERABLE_TAGS[tag]) {
    return getSortedIterablePairs(value, cache, keys);
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.DATE) {
    return OBJECT_CLASS_MAP[tag] + SEPARATOR + value.getTime();
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.ERROR) {
    return OBJECT_CLASS_MAP[tag] + SEPARATOR + value.stack;
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.EVENT) {
    return getSortedEvent(value);
  }

  if (UNPARSEABLE_TAGS[tag]) {
    return OBJECT_CLASS_MAP[tag] + SEPARATOR + 'NOT_ENUMERABLE';
  }

  if (HTML_ELEMENT_REGEXP.test(tag) || SVG_ELEMENT_REGEXP.test(tag)) {
    return tag.slice(8, -1) + SEPARATOR + value.outerHTML;
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.DOCUMENTFRAGMENT) {
    return (
      OBJECT_CLASS_MAP[tag] + SEPARATOR + getStringifiedDocumentFragment(value)
    );
  }

  if (TYPEDARRAY_TAGS[tag]) {
    return OBJECT_CLASS_MAP[tag] + SEPARATOR + value.join(',');
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.ARRAYBUFFER) {
    return OBJECT_CLASS_MAP[tag] + SEPARATOR + getStringifiedArrayBuffer(value);
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.DATAVIEW) {
    return (
      OBJECT_CLASS_MAP[tag] +
      SEPARATOR +
      getStringifiedArrayBuffer(value.buffer)
    );
  }

  return value;
}

/**
 * @function replacer
 *
 * @description
 * create the replacer function used for stringification
 *
 * @param {WeakSet|Object} sortedCache the cache to use for sorting objects
 * @returns {function(key: string, value: any)} function getting the normalized value
 */
export function createReplacer(cache = [], keys = []) {
  return function(key, value) {
    if (typeof value === 'object') {
      if (cache.length) {
        const thisCutoff = getCutoffIndex(cache, this);

        if (thisCutoff === 0) {
          cache.push(this);
        } else {
          cache.splice(thisCutoff);
          keys.splice(thisCutoff);
        }

        keys.push(key);

        const valueCutoff = getCutoffIndex(cache, value);

        if (valueCutoff !== 0) {
          const ref = keys.slice(0, valueCutoff).join('.') || '.';

          return `[~${ref}]`;
        }

        cache.push(value);
      } else {
        cache[0] = value;
        keys[0] = key;
      }
    }

    if (key && this[key] instanceof Date) {
      return getNormalizedValue(
        this[key],
        cache,
        keys,
        OBJECT_CLASS_TYPE_MAP.DATE,
        cache,
        keys
      );
    }

    return getNormalizedValue(value, cache, keys);
  };
}

/**
 * @function stringify
 *
 * @description
 * stringify the value based on the options passed
 *
 * @param {any} value the value to stringify
 * @returns {string} the stringified value
 */
export function stringify(value, cache, keys) {
  if (!value || typeof value !== 'object') {
    return getNormalizedValue(value, cache, keys);
  }

  const tag = toString.call(value);

  if (
    tag === OBJECT_CLASS_TYPE_MAP.DATE
    || tag === OBJECT_CLASS_TYPE_MAP.REGEXP
  ) {
    return getNormalizedValue(value, cache, keys, tag);
  }

  return JSON.stringify(value, createReplacer(cache, keys));
}
