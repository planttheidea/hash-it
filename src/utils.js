// external dependencies
import prune from 'json-prune';

// constants
import {
  HTML_ELEMENT_REGEXP,
  OBJECT_CLASS_MAP,
  OBJECT_CLASS_TYPE_MAP,
  MATH_OBJECT,
  RECURSIVE_COUNTER_CUTOFF,
  REPLACE_RECURSIVE_VALUE_CLASSES,
  REPLACE_STRINGIFICATION_CLASSES,
  STRINGIFY_ITERABLE_CLASSES,
  STRINGIFY_NOT_ENUMERABLE_CLASSES,
  STRINGIFY_PREFIX_JOIN_CLASSES,
  STRINGIFY_PREFIX_CLASSES,
  STRINGIFY_PREFIX_TYPES,
  STRINGIFY_SELF_CLASSES,
  STRINGIFY_SELF_TYPES,
  STRINGIFY_TOSTRING_TYPES,
  STRINGIFY_TYPEOF_TYPES
} from './constants';

const toString = Object.prototype.toString;

/**
 * @function getIterablePairs
 *
 * @description
 * get the [key,value] pairs for maps and sets
 *
 * @param {Map|Set} iterable the iterable to map
 * @param {string} type the type of object class
 * @returns {Array<Array>} the [key, value] pairs
 */
export const getIterablePairs = (iterable, type) => {
  let pairs = [OBJECT_CLASS_MAP[type]];

  iterable.forEach((item, key) => {
    pairs.push([key, item]);
  });

  return pairs;
};

/**
 * @function getStringFromArrayBuffer
 *
 * @description
 * get the string value of the buffer passed
 *
 * @param {ArrayBuffer} buffer the array buffer to convert
 * @returns {string} the stringified buffer
 */
export const getStringFromArrayBuffer = (buffer) => {
  return typeof Uint16Array === 'undefined' ? '' : String.fromCharCode.apply(null, new Uint16Array(buffer));
};
/**
 * @function getTypePrefixedString
 *
 * @description
 * prepend type to string value
 *
 * @param {string} string the string to prepend
 * @param {string} type the type to add as a prefix
 * @returns {string} the prefixed string
 */
export const getTypePrefixedString = (string, type) => {
  return `${OBJECT_CLASS_MAP[type]} ${string}`;
};

/**
 * @function getStringifiedElement
 *
 * @description
 * get the HTML element stringified by its type, attributes, and contents
 *
 * @param {HTMLElement} element the element to stringify
 * @returns {string} the stringified elements
 */
export const getStringifiedElement = (element) => {
  const attributes = element.attributes;

  let attributesString = '';

  for (let index = 0; index < attributes.length; index++) {
    attributesString += `${attributes[index].name}="${attributes[index].value}",`;
  }

  return `${element.tagName} ${attributesString} ${element.innerHTML}`;
};

/**
 * @function getStringifiedValueByObjectClass
 *
 * @description
 * get the stringified value of the object based based on its toString class
 *
 * @param {*} object the object to get the stringification value for
 * @param {string} [passedObjectClass] the object class for the object passed
 * @returns {*} the value to stringify with
 */
export const getStringifiedValueByObjectClass = (object, passedObjectClass) => {
  const objectClass = passedObjectClass || toString.call(object);

  if (~STRINGIFY_SELF_CLASSES.indexOf(objectClass)) {
    return object;
  }

  if (~STRINGIFY_PREFIX_CLASSES.indexOf(objectClass) || object === null) {
    return getTypePrefixedString(object, objectClass);
  }

  if (objectClass === OBJECT_CLASS_TYPE_MAP.DATE) {
    return getTypePrefixedString(object.valueOf(), objectClass);
  }

  if (~STRINGIFY_ITERABLE_CLASSES.indexOf(objectClass)) {
    return getIterablePairs(object, objectClass);
  }

  if (~STRINGIFY_NOT_ENUMERABLE_CLASSES.indexOf(objectClass)) {
    return getTypePrefixedString('NOT_ENUMERABLE', objectClass);
  }

  if (objectClass === OBJECT_CLASS_TYPE_MAP.ARRAYBUFFER) {
    return getTypePrefixedString(getStringFromArrayBuffer(object), objectClass);
  }

  if (objectClass === OBJECT_CLASS_TYPE_MAP.DATAVIEW) {
    return getTypePrefixedString(getStringFromArrayBuffer(object.buffer), objectClass);
  }

  if (~STRINGIFY_PREFIX_JOIN_CLASSES.indexOf(objectClass)) {
    return getTypePrefixedString(object.join(','), objectClass);
  }

  if (objectClass === OBJECT_CLASS_TYPE_MAP.MATH) {
    return MATH_OBJECT;
  }

  return HTML_ELEMENT_REGEXP.test(objectClass)
    ? getTypePrefixedString(getStringifiedElement(object), OBJECT_CLASS_TYPE_MAP.HTMLELEMENT)
    : object;
};

/**
 * @function getValueForStringification
 *
 * @description
 * get the string value for the object used for stringification
 *
 * @param {*} object the object to get the stringification value for
 * @returns {*} the value to stringify with
 */
export const getValueForStringification = (object) => {
  const type = typeof object;

  if (~STRINGIFY_SELF_TYPES.indexOf(type)) {
    return object;
  }

  if (~STRINGIFY_PREFIX_TYPES.indexOf(type)) {
    return getTypePrefixedString(
      ~STRINGIFY_TOSTRING_TYPES.indexOf(type) ? object.constructor.prototype.toString.call(object) : object,
      toString.call(object)
    );
  }

  return getStringifiedValueByObjectClass(object);
};

/**
 * @function getCircularStackValue
 *
 * @description
 * get the value either from the recursive storage stack
 * or itself after being added to that stack
 *
 * @param {*} value the value to check for existing
 * @param {string} type the type of the value
 * @param {Array<*>} stack the current stack of values
 * @param {number} circularCounter the counter of circular references
 * @returns {*} the value to apply
 */
export const getCircularStackValue = (value, type, stack, circularCounter) => {
  if (!value) {
    return getTypePrefixedString(value, type);
  }

  if (circularCounter > RECURSIVE_COUNTER_CUTOFF) {
    stack.length = 0;

    return value;
  }

  let existingIndex = stack.indexOf(value);

  if (!~existingIndex) {
    stack.push(value);

    return value;
  }

  return `*Circular-${existingIndex}`;
};

/**
 * @function createReplacer
 *
 * @description
 * create the replacer function leveraging closure for recursive stack storage
 *
 * @param {Array<*>} stack the stack to store in memory
 * @returns {function} the replacer to use
 */
export const createReplacer = (stack) => {
  let circularCounter = 1,
      objectClass;

  return (key, value) => {
    if (!key) {
      stack = [value];

      return value;
    }

    if (value === null) {
      return getStringifiedValueByObjectClass(value, OBJECT_CLASS_TYPE_MAP.NULL);
    }

    if (~STRINGIFY_TYPEOF_TYPES.indexOf(typeof value)) {
      return getValueForStringification(value);
    }

    objectClass = toString.call(value);

    if (~REPLACE_RECURSIVE_VALUE_CLASSES.indexOf(objectClass)) {
      return getCircularStackValue(value, objectClass, stack, ++circularCounter);
    }

    if (~REPLACE_STRINGIFICATION_CLASSES.indexOf(objectClass)) {
      return getStringifiedValueByObjectClass(value, objectClass);
    }

    return value;
  };
};

/**
 * @function getIntegerHashValue
 *
 * @description
 * based on string passed, get the integer hash value
 * through bitwise operation (based on spinoff of dbj2)
 *
 * @param {string} string the string to get the hash value for
 * @returns {number} the hash value
 */
export const getIntegerHashValue = (string) => {
  if (!string) {
    return 0;
  }

  let hashValue = 5381;

  for (let index = 0; index < string.length; index++) {
    hashValue = (hashValue << 5) + hashValue + string.charCodeAt(index);
  }

  return hashValue >>> 0;
};

/**
 * @function tryCatch
 *
 * @description
 * move try/catch to standalone function as any function that contains a try/catch
 * is not optimized (this allows optimization for as much as possible)
 *
 * @param {*} value the value to stringify
 * @returns {string} the stringified value
 */
export const tryCatch = (value) => {
  try {
    return JSON.stringify(value, createReplacer([]));
  } catch (exception) {
    return prune(value);
  }
};

/**
 * @function getStringifiedValue
 *
 * @description
 * stringify the object passed leveraging JSON.stringify
 * with REPLACER, falling back to prune
 *
 * @param {*} object the object to stringify
 * @param {boolean} isCircular is the object circular or not
 * @returns {string} the stringified object
 */
export const getStringifiedValue = (object, isCircular) => {
  const valueForStringification = getValueForStringification(object);

  if (typeof valueForStringification === 'string') {
    return valueForStringification;
  }

  return isCircular
    ? tryCatch(getValueForStringification(object))
    : JSON.stringify(valueForStringification, createReplacer([]));
};
