import json from './prune';

import {
  ARGUMENTS,
  ARRAY,
  ARRAY_BUFFER,
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
  OBJECT,
  PROMISE,
  REGEXP,
  SET,
  UINT_8_ARRAY,
  UINT_8_CLAMPED_ARRAY,
  UINT_16_ARRAY,
  UINT_32_ARRAY,
  UNDEFINED,
  WEAKMAP,
  WEAKSET,

  BOOLEAN_TYPEOF,
  FUNCTION_TYPEOF,
  NUMBER_TYPEOF,
  STRING_TYPEOF,
  SYMBOL_TYPEOF,
  UNDEFINED_TYPEOF,
  toFunctionString,
  toString
} from './toString';

const HTML_ELEMENT_REGEXP = /\[object (HTML(.*)Element)\]/;
const MATH_OBJECT = [
  'E',
  'LN2',
  'LN10',
  'LOG2E',
  'LOG10E',
  'PI',
  'SQRT1_2',
  'SQRT2'
].reduce((mathObject, property) => {
  return {
    ...mathObject,
    [property]: Math[property]
  };
}, {});

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
  return type.substring(8, type.length - 1);
};

/**
 * get the key,value pairs for maps and sets
 *
 * @param {Map|Set} iterable
 * @param {string} type
 * @returns {Array<Array>}
 */
const getIterablePairs = (iterable, type) => {
  let pairs = [getObjectType(type)];

  iterable.forEach((item, key) => {
    pairs.push([key, item]);
  });

  return pairs;
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

const getStringifiedValueByObjectClass = (object) => {
  const type = toString(object);

  switch (type) {
    case ARRAY:
    case OBJECT:
    case ARGUMENTS:
      return object;

    case ERROR:
    case NULL:
    case REGEXP:
      return prependTypeToString(object, type);

    case DATE:
      return prependTypeToString(object.valueOf(), type);

    case PROMISE:
    case WEAKMAP:
    case WEAKSET:
      return prependTypeToString('NOT_ENUMERABLE', type);

    case MAP:
    case SET:
      return getIterablePairs(object, type);

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
      return MATH_OBJECT;

    default:
      return HTML_ELEMENT_REGEXP.test(type) ? `HTMLElement ${object.textContent}` : object;
  }
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
  switch (typeof object) {
    case STRING_TYPEOF:
    case NUMBER_TYPEOF:
      return object;

    case BOOLEAN_TYPEOF:
    case UNDEFINED_TYPEOF:
      return prependTypeToString(object, toString(object));

    case FUNCTION_TYPEOF:
      return toFunctionString(object, toString(object) === GENERATOR);

    case SYMBOL_TYPEOF:
      return object.toString();

    default:
      return getStringifiedValueByObjectClass(object);
  }
};

/**
 * get the value either from the recursive storage stack
 * or itself after being added to that stack
 *
 * @param {*} value
 * @param {string} type
 * @param {Array<*>} stack
 * @param {number} index
 * @param {number} recursiveCounter
 * @returns {*}
 */
const getRecursiveStackValue = (value, type, stack, index, recursiveCounter) => {
  if (!value) {
    return prependTypeToString(value, type);
  }

  if (recursiveCounter > 255) {
    return 'Undefined undefined';
  }

  index = stack.indexOf(value);

  if (!~index) {
    stack.push(value);

    return value;
  }

  return `*Recursive-${index}`;
};

/**
 * create the replacer function leveraging closure for
 * recursive stack storage
 */
const REPLACER = ((stack, undefined, recursiveCounter, index) => {
  return (key, value) => {
    if (!key) {
      stack = [value];
      recursiveCounter = 0;

      return value;
    }

    const type = toString(value);

    switch (typeof value) {
      case STRING_TYPEOF:
      case NUMBER_TYPEOF:
      case BOOLEAN_TYPEOF:
        return value;

      case UNDEFINED_TYPEOF:
      case FUNCTION_TYPEOF:
        return getValueForStringification(value);

      case SYMBOL_TYPEOF:
        return value.toString();

      default:
        switch (type) {
          case ARRAY:
          case OBJECT:
            return getRecursiveStackValue(value, type, stack, index, ++recursiveCounter);

          case ARGUMENTS:
            return value;

          case DATE:
          case FUNCTION:
          case MAP:
          case SET:
          case PROMISE:
          case REGEXP:
          case NULL:
          case ARRAY_BUFFER:
          case DATA_VIEW:
          case FLOAT_32_ARRAY:
          case FLOAT_64_ARRAY:
          case GENERATOR:
          case INT_8_ARRAY:
          case INT_16_ARRAY:
          case INT_32_ARRAY:
          case ERROR:
          case MATH:
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

  const length = string.length;

  let hashValue = 5381,
      index = -1;

  while (++index < length) {
    hashValue = ((hashValue << 5) + hashValue) + string.charCodeAt(index);
  }

  return hashValue >>> 0;
};

/**
 * perform JSON.stringify on the value with the custom REPLACER
 *
 * @param {*} value
 * @returns {string}
 */
const stringify = (value) => {
  return JSON.stringify(value, REPLACER);
};

/**
 * perform json.prune on the value
 *
 * @param {*} value
 * @returns {string}
 */
const prune = (value) => {
  return json.prune(value);
};

/**
 * move try/catch to standalone function as any function that contains a try/catch
 * is not optimized (this allows optimization for as much as possible)
 * fac
 * @param {*} value
 * @returns {string}
 */
const tryCatch = (value) => {
  try {
    return stringify(value, REPLACER);
  } catch (exception) {
    return prune(value);
  }
};

/**
 * stringify the object passed leveraging JSON.stringify
 * with REPLACER, falling back to prune
 *
 * @param {*} object
 * @returns {string}
 */
const getStringifiedValue = (object) => {
  const valueForStringification = getValueForStringification(object);

  if (typeof valueForStringification === 'string') {
    return valueForStringification;
  }

  return stringify(valueForStringification);
};

/**
 * stringify the object passed leveraging JSON.stringify
 * with REPLACER
 *
 * @param {*} object
 * @returns {string}
 */
const getStringifiedValueWithRecursion = (object) => {
  const valueForStringification = getValueForStringification(object);

  if (typeof valueForStringification === 'string') {
    return valueForStringification;
  }

  return tryCatch(getValueForStringification(object));
};

export {getIntegerHashValue};
export {getStringifiedValue};
export {getStringifiedValueWithRecursion};
export {REPLACER as replacer};
