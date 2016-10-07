import json from './prune';

import {
  ARGUMENTS,
  ARRAY,
  ARRAY_BUFFER,
  BOOLEAN,
  DATA_VIEW,
  DATE,
  ERROR,
  FLOAT_32_ARRAY,
  FLOAT_64_ARRAY,
  FUNCTION,
  GENERATOR,
  INT_8_ARRAY,
  INT_16_ARRAY,
  INT_32_ARRAY,
  MAP,
  MATH,
  NULL,
  NUMBER,
  OBJECT,
  PROMISE,
  REGEXP,
  SET,
  STRING,
  SYMBOL,
  UINT_8_ARRAY,
  UINT_8_CLAMPED_ARRAY,
  UINT_16_ARRAY,
  UINT_32_ARRAY,
  UNDEFINED,
  WEAKMAP,
  WEAKSET,
  toFunctionString,
  toString
} from './toString';

const HTML_ELEMENT_REGEXP = /\[object (HTML(.*)Element)\]/;
const MATH_PROPERTIES = [
  'E',
  'LN2',
  'LN10',
  'LOG2E',
  'LOG10E',
  'PI',
  'SQRT1_2',
  'SQRT2'
];

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
 * prepend type to string value
 * 
 * @param {string} string
 * @param {string} type
 * @returns {string}
 */
const prependTypeToString = (string, type) => {
  return `${getObjectType(type)} ${string}`;
};

/**
 * get the string value for the object used for stringification
 *
 * @param {*} object
 * @param {ArrayBuffer} [object.buffer]
 * @param {function} [object.forEach]
 * @param {function} [object.join]
 * @param {string} [object.textContent]
 * @returns {*}
 */
const getValueForStringification = (object) => {
  const type = toString(object);

  switch (type) {
    case ARGUMENTS:
    case ARRAY:
    case BOOLEAN:
    case NUMBER:
    case STRING:
      return object;

    case OBJECT:
      return !!object ? object : prependTypeToString(object, type);

    case ERROR:
    case NULL:
    case REGEXP:
    case UNDEFINED:
      return prependTypeToString(object, type);

    case DATE:
      return prependTypeToString(object.valueOf(), type);

    case FUNCTION:
    case GENERATOR:
      return toFunctionString(object, type === GENERATOR);

    case SYMBOL:
      return object.toString();

    case PROMISE:
    case WEAKMAP:
    case WEAKSET:
      return prependTypeToString('NOT_ENUMERABLE', type);

    case MAP:
    case SET:
      let pairs = [getObjectType(type)];

      object.forEach((item, key) => {
        pairs.push([
          key, item
        ]);
      });

      return pairs;

    case ARRAY_BUFFER:
      return prependTypeToString(arrayBufferToString(object), type);

    case DATA_VIEW:
      return prependTypeToString(arrayBufferToString(object.buffer), type);

    case FLOAT_32_ARRAY:
    case FLOAT_64_ARRAY:
    case INT_8_ARRAY:
    case INT_16_ARRAY:
    case INT_32_ARRAY:
    case UINT_8_ARRAY:
    case UINT_8_CLAMPED_ARRAY:
    case UINT_16_ARRAY:
    case UINT_32_ARRAY:
      return prependTypeToString(object.join(','), type);

    case MATH:
      let mathObject = {};

      MATH_PROPERTIES.forEach((prop) => {
        mathObject[prop] = object[prop];
      });

      return mathObject;

    default:
      return HTML_ELEMENT_REGEXP.test(type) ? `HTMLElement ${object.textContent}` : object;
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

    const type = toString(value);

    switch (type) {
      case ARGUMENTS:
      case BOOLEAN:
      case NUMBER:
      case STRING:
        return value;

      case ARRAY:
      case OBJECT:
        if (!value) {
          return prependTypeToString(value, type);
        }

        if (++recursiveCounter > 255) {
          return 'Undefined undefined';
        }

        index = stack.indexOf(value);

        if (!~index) {
          stack.push(value);

          return value;
        }

        return `*Recursive-${index}`;

      case ARRAY_BUFFER:
      case DATA_VIEW:
      case DATE:
      case FLOAT_32_ARRAY:
      case FLOAT_64_ARRAY:
      case FUNCTION:
      case GENERATOR:
      case INT_8_ARRAY:
      case INT_16_ARRAY:
      case INT_32_ARRAY:
      case ERROR:
      case MAP:
      case MATH:
      case NULL:
      case PROMISE:
      case REGEXP:
      case SET:
      case SYMBOL:
      case UINT_8_ARRAY:
      case UINT_8_CLAMPED_ARRAY:
      case UINT_16_ARRAY:
      case UINT_32_ARRAY:
      case UNDEFINED:
      case WEAKMAP:
      case WEAKSET:
        return getValueForStringification(value);

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
 * @param {*} value
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
 * @param {*} object
 * @returns {string}
 */
const stringify = (object) => {
  return tryCatch(getValueForStringification(object));
};

export {getIntegerHashValue};
export {REPLACER as replacer};
export {stringify};
