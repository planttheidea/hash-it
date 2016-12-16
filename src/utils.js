// external dependencies
import json from './prune';

// constants
import {
  ARGUMENTS,
  ARRAY,
  ARRAY_BUFFER,
  DATA_VIEW,
  DATE,
  ERROR,
  FLOAT_32_ARRAY,
  FLOAT_64_ARRAY,
  GENERATOR,
  INT_8_ARRAY,
  INT_16_ARRAY,
  INT_32_ARRAY,
  MAP,
  MATH,
  OBJECT,
  PROMISE,
  REGEXP,
  SET,
  UINT_8_ARRAY,
  UINT_8_CLAMPED_ARRAY,
  UINT_16_ARRAY,
  UINT_32_ARRAY,
  WEAKMAP,
  WEAKSET,

  BOOLEAN_TYPEOF,
  FUNCTION_TYPEOF,
  NUMBER_TYPEOF,
  STRING_TYPEOF,
  SYMBOL_TYPEOF,
  UNDEFINED_TYPEOF,

  HTML_ELEMENT_REGEXP,
  MATH_OBJECT
} from './constants';

// toString
import {
  toFunctionString,
  toString
} from './toString';

/**
 * get the string value of the buffer passed
 *
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
export const arrayBufferToString = (buffer) => {
  if (typeof Uint16Array === UNDEFINED_TYPEOF) {
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
export const getObjectType = (type) => {
  return type.slice(8, -1);
};

/**
 * get the key,value pairs for maps and sets
 *
 * @param {Map|Set} iterable
 * @param {string} type
 * @returns {Array<Array>}
 */
export const getIterablePairs = (iterable, type) => {
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
export const prependTypeToString = (string, type) => {
  return `${getObjectType(type)} ${string}`;
};

/**
 * is the object passed null
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isNull = (object) => {
  return object === null;
};

/**
 * get the stringified value of the object based based on its toString class
 *
 * @param {*} object
 * @returns {*}
 */
export const getStringifiedValueByObjectClass = (object) => {
  const type = toString(object);

  if (type === ARRAY || type === OBJECT || type === ARGUMENTS) {
    return object;
  }

  if (type === ERROR || type === REGEXP || isNull(object)) {
    return prependTypeToString(object, type);
  }

  if (type === DATE) {
    return prependTypeToString(object.valueOf(), type);
  }

  if (type === MAP || type === SET) {
    return getIterablePairs(object, type);
  }

  if (type === PROMISE || type === WEAKMAP || type === WEAKSET) {
    return prependTypeToString('NOT_ENUMERABLE', type);
  }

  if (type === ARRAY_BUFFER) {
    return prependTypeToString(arrayBufferToString(object), type);
  }

  if (type === DATA_VIEW) {
    return prependTypeToString(arrayBufferToString(object.buffer), type);
  }

  if (
    type === FLOAT_32_ARRAY ||
    type === FLOAT_64_ARRAY ||
    type === INT_8_ARRAY ||
    type === INT_16_ARRAY ||
    type === INT_32_ARRAY ||
    type === UINT_8_ARRAY ||
    type === UINT_8_CLAMPED_ARRAY ||
    type === UINT_16_ARRAY ||
    type === UINT_32_ARRAY
  ) {
    return prependTypeToString(object.join(','), type);
  }

  if (type === MATH) {
    return MATH_OBJECT;
  }

  return HTML_ELEMENT_REGEXP.test(type) ? `HTMLElement ${object.textContent}` : object;
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
export const getValueForStringification = (object) => {
  const type = typeof object;

  if (type === STRING_TYPEOF || type === NUMBER_TYPEOF) {
    return object;
  }

  if (type === BOOLEAN_TYPEOF || type === UNDEFINED_TYPEOF) {
    return prependTypeToString(object, toString(object));
  }

  if (type === FUNCTION_TYPEOF) {
    return toFunctionString(object, toString(object) === GENERATOR);
  }

  if (type === SYMBOL_TYPEOF) {
    return object.toString();
  }

  return getStringifiedValueByObjectClass(object);
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
export const getRecursiveStackValue = (value, type, stack, index, recursiveCounter) => {
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
export const REPLACER = (() => {
  let stack, recursiveCounter, index, type;

  return (key, value) => {
    if (!key) {
      stack = [value];
      recursiveCounter = 0;

      return value;
    }

    type = typeof value;

    if (type === STRING_TYPEOF || type === NUMBER_TYPEOF || type === BOOLEAN_TYPEOF) {
      return value;
    }

    if (type === UNDEFINED_TYPEOF || type === FUNCTION_TYPEOF) {
      return getValueForStringification(value);
    }

    if (type === SYMBOL_TYPEOF) {
      return value.toString();
    }

    type = toString(value);

    if (type === ARRAY || type === OBJECT) {
      return getRecursiveStackValue(value, type, stack, index, ++recursiveCounter);
    }

    if (type === ARGUMENTS) {
      return value;
    }

    if (
      type === DATE ||
      type === MAP ||
      type === SET ||
      type === PROMISE ||
      type === REGEXP ||
      isNull(value) ||
      type === ERROR ||
      type === GENERATOR ||
      type === WEAKMAP ||
      type === WEAKSET ||
      type === MATH ||
      type === ARRAY_BUFFER ||
      type === DATA_VIEW ||
      type === FLOAT_32_ARRAY ||
      type === FLOAT_64_ARRAY ||
      type === INT_8_ARRAY ||
      type === INT_16_ARRAY ||
      type === INT_32_ARRAY ||
      type === UINT_8_ARRAY ||
      type === UINT_8_CLAMPED_ARRAY ||
      type === UINT_16_ARRAY ||
      type === UINT_32_ARRAY
    ) {
      return getValueForStringification(value);
    }

    return value;
  };
})();

/**
 * based on string passed, get the integer hash value
 * through bitwise operation (based on spinoff of dbj2)
 *
 * @param {string} string
 * @returns {number}
 */
export const getIntegerHashValue = (string) => {
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
export const stringify = (value) => {
  return JSON.stringify(value, REPLACER);
};

/**
 * move try/catch to standalone function as any function that contains a try/catch
 * is not optimized (this allows optimization for as much as possible)
 * fac
 * @param {*} value
 * @returns {string}
 */
export const tryCatch = (value) => {
  try {
    return stringify(value);
  } catch (exception) {
    return json.prune(value);
  }
};

/**
 * stringify the object passed leveraging JSON.stringify
 * with REPLACER, falling back to prune
 *
 * @param {*} object
 * @returns {string}
 */
export const getStringifiedValue = (object) => {
  const valueForStringification = getValueForStringification(object);

  if (typeof valueForStringification === STRING_TYPEOF) {
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
export const getStringifiedValueWithRecursion = (object) => {
  const valueForStringification = getValueForStringification(object);

  if (typeof valueForStringification === STRING_TYPEOF) {
    return valueForStringification;
  }

  return tryCatch(getValueForStringification(object));
};
