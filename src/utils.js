import json from './prune';

import {
  toFunctionString,
  toString,
  types
} from './toString';

const HTML_ELEMENT_REGEXP = /\[object (HTML(.*)Element)\]/;

/**
 * get the string value of the buffer passed
 * 
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
const arrayBufferToString = (buffer) => {
  if (typeof Uint16Array === 'undefined') {
    return '';
  }

  return String.fromCharCode.apply(null, new Uint16Array(buffer));
};

/**
 * strip away [object and ] from return of toString()
 * to get the object class
 * 
 * @param {string} type
 * @returns {string}
 */
const getObjectType = (type) => {
  return type.replace(/^\[object (.+)\]$/, '$1');
};

/**
 * get the string value for the object used for stringification
 *
 * @param {any} object
 * @returns {any}
 */
const getValueForStringification = (object) => {
  const type = toString(object);

  switch (type) {
    case types.ARRAY_BUFFER:
      return arrayBufferToString(object);

    case types.FLOAT_32_ARRAY:
    case types.FLOAT_64_ARRAY:
    case types.INT_8_ARRAY:
    case types.INT_16_ARRAY:
    case types.INT_32_ARRAY:
    case types.UINT_8_ARRAY:
    case types.UINT_8_CLAMPED_ARRAY:
    case types.UINT_16_ARRAY:
    case types.UINT_32_ARRAY:
      return `${getObjectType(type)} [${object.join(',')}]`;

    case types.DATE:
      return `${object.valueOf()}`;

    case types.FUNCTION:
      return toFunctionString(object);

    case types.ERROR:
    case types.NULL:
    case types.NUMBER:
    case types.REGEXP:
    case types.UNDEFINED:
      return `${object}`;

    case types.MAP:
    case types.SET:
      let pairs = [];

      object.forEach((item, key) => {
        pairs.push([
          key, item
        ]);
      });

      return pairs;

    case types.OBJECT:
      return !!object ? object : `${object}`;

    case types.SYMBOL:
      return object.toString();

    case types.MATH:
      return 'Math--NOT_ENUMERABLE';

    case types.WEAKMAP:
      return 'WeakMap--NOT_ENUMERABLE';

    case types.WEAKSET:
      return 'WeakSet--NOT_ENUMERABLE';

    default:
      return HTML_ELEMENT_REGEXP.test(type) ? object.textContent : object;
  }
};

/**
 * create the replacer function leveraging closure for
 * recursive stack storage
 */
const REPLACER = ((stack, undefined, recursiveCounter, index) => {
  return (key, value) => {
    if (key === '') {
      stack = [value];
      recursiveCounter = 0;

      return value;
    }

    switch (toString(value)) {
      case types.DATE:
      case types.FUNCTION:
      case types.ERROR:
      case types.MAP:
      case types.MATH:
      case types.NULL:
      case types.REGEXP:
      case types.SET:
      case types.SYMBOL:
      case types.WEAKMAP:
      case types.WEAKSET:
      case types.UNDEFINED:
        return getValueForStringification(value);

      case types.ARRAY:
      case types.OBJECT:
        if (!value) {
          return `${value}`;
        }

        if (++recursiveCounter > 255) {
          return 'undefined';
        }

        index = stack.indexOf(value);

        if (!~index) {
          stack.push(value);

          return value;
        }

        return `*Recursive-${index}`;

      default:
        return value;
    }
  };
})();

/**
 * based on string passed, get the integer hash value
 * through bitwise operation (based on spinoff of dbj2)
 *
 * @param {string} string
 * @returns {number}
 */
const getIntegerHashValue = (string) => {
  if (!string) {
    return 0;
  }

  let hashValue = 5381,
      index = string.length;

  while (index) {
    hashValue = (hashValue * 33) ^ string.charCodeAt(--index);
  }

  return hashValue >>> 0;
};

/**
 * move try/catch to standalone function as any function that contains a try/catch
 * is not optimized (this allows optimization for as much as possible)
 * 
 * @param {any} value
 * @returns {string}
 */
const tryCatch = (value) => {
  try {
    return JSON.stringify(value, REPLACER);
  } catch (exception) {
    return json.prune(value);
  }
};

/**
 * stringify the object passed leveraging the REPLACER
 *
 * @param {any} object
 * @returns {string}
 */
const stringify = (object) => {
  const value = getValueForStringification(object);

  return tryCatch(value);
};

export {getIntegerHashValue};
export {REPLACER as replacer};
export {stringify};
