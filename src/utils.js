// external dependencies
import fastStringify from 'fast-stringify';

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
  STRING_TYPEOF,
  TOSTRING_TAGS,
  TYPEDARRAY_TAGS,
  UNPARSEABLE_TAGS
} from './constants';

const charCodeAt = String.prototype.charCodeAt;
const keys = Object.keys;

/**
 * @function getCircularValue
 *
 * @description
 * get the value used when circular references are found
 *
 * @param {string} key the key in the stringification object
 * @param {any} value the value to stringify
 * @param {number} refCount the circular reference count
 * @returns {string} the value for stringification
 */
export const getCircularValue = (key, value, refCount) => `${refCount}`;

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

  const length = string.length;

  let hash = 5381;

  for (let index = 0; index < length; index++) {
    hash = (hash << 5) + hash + charCodeAt.call(string, index);
  }

  return hash >>> 0;
};

/**
 * @function getIterablePairs
 *
 * @description
 * get the pairs in the iterable for stringification
 *
 * @param {Map|Set} iterable the iterable to get the pairs for
 * @param {Object} options the options for stringification
 * @returns {Array<{key: string, value: any}>} the pairs
 */
export const getIterablePairs = (iterable, options) => {
  const pairs = [];
  const isMap = typeof iterable.get === 'function';

  iterable.forEach((value, key) => {
    pairs.push(
      isMap
        ? // eslint-disable-next-line no-use-before-define
        {key, keyString: stringify(key, options), value}
        : // eslint-disable-next-line no-use-before-define
        {key, keyString: stringify(key, options)}
    );
  });

  pairs.sort(
    options.sortIterableBy ||
      ((pairA, pairB) => (pairA.keyString > pairB.keyString ? 1 : pairA.keyString < pairB.keyString ? -1 : 0))
  );

  const finalPairs = new Array(pairs.length);

  let pair;

  for (let index = 0; finalPairs < iterable.size; index++) {
    pair = pairs[index];

    finalPairs[index] = isMap ? {key: pair.keyString, value: pair.value} : {key: pair.keyString};
  }

  return finalPairs;
};

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
export const getPrefixedValue = (tag, value) => `${OBJECT_CLASS_MAP[tag] || tag}|${value}`;

/**
 * @function getSortedObject
 *
 * @description
 * get the object with the keys sorted
 *
 * @param {Object} object the object to sort
 * @param {Object} options the options for stringification
 * @returns {Object} the sorted object
 */
export const getSortedObject = (object, options) => {
  const objectKeys = keys(object);
  const newObject = {};

  objectKeys.sort(options.sortObjectBy);

  let key;

  for (let index = 0; index < objectKeys.length; index++) {
    key = objectKeys[index];

    newObject[key] = object[key];
  }

  return newObject;
};

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
    ? (buffer) => Buffer.from(buffer).toString('utf8')
    : HAS_UINT16ARRAY_SUPPORT
      ? (buffer) => String.fromCharCode.apply(null, new Uint16Array(buffer))
      : () => '')();

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

  let stringifiedElement = element.innerHTML ? `${element.tagName} ${element.innerHTML}` : element.tagName,
      attribute;

  for (let index = 0; index < attributes.length; index++) {
    attribute = attributes[index];

    stringifiedElement += ` ${attribute.name}="${attribute.value}"`;
  }

  return stringifiedElement;
};

/**
 * @function getNormalizedValue
 *
 * @description
 * get the value normalized for stringification
 *
 * @param {any} value the value to normalize
 * @param {Object} options the options for stringification
 * @returns {any} the normalized value
 */
export const getNormalizedValue = (value, options) => {
  const type = typeof value;

  if (type === STRING_TYPEOF) {
    return value;
  }

  if (PRIMITIVE_TAGS[type] || value === null) {
    return getPrefixedValue(type, TOSTRING_TAGS[type] ? value.toString() : value);
  }

  const tag = toString.call(value);

  if (SELF_TAGS[tag]) {
    return value;
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.OBJECT) {
    return getSortedObject(value, options);
  }

  if (TOSTRING_TAGS[tag]) {
    return getPrefixedValue(tag, value.toString());
  }

  if (ITERABLE_TAGS[tag]) {
    return getIterablePairs(value, options);
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.DATE) {
    return getPrefixedValue(tag, value.getTime());
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.ERROR) {
    return getPrefixedValue(tag, value.stack);
  }

  if (UNPARSEABLE_TAGS[tag]) {
    return getPrefixedValue(tag, 'NOT_ENUMERABLE');
  }

  if (HTML_ELEMENT_REGEXP.test(tag)) {
    return getPrefixedValue(tag.slice(8, -1), getStringifiedElement(value));
  }

  if (TYPEDARRAY_TAGS[tag]) {
    return getPrefixedValue(tag, value.join(','));
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.ARRAYBUFFER) {
    return getPrefixedValue(tag, getStringifiedArrayBuffer(value));
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.DATAVIEW) {
    return getPrefixedValue(tag, getStringifiedArrayBuffer(value.buffer));
  }

  return value;
};

/**
 * @function createReplacer
 *
 * @description
 * create the replacer function used for stringification
 *
 * @param {Object} options the options for stringification
 * @returns {function(string, any): any} the function that replaces the value with the normalized value
 */
export const createReplacer = (options) => (key, value) => getNormalizedValue(value, options);

/**
 * @function stringify
 *
 * @description
 * stringify the value based on the options passed
 *
 * @param {any} value the value to stringify
 * @param {Object} options the options for stringification
 * @returns {string} the stringified value
 */
export function stringify(value, options) {
  return typeof value === 'object'
    ? fastStringify(value, createReplacer(options), null, getCircularValue)
    : getNormalizedValue(value, options);
}
