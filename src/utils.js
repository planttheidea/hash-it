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
 * @function sortIterablePair
 *
 * @description
 * get the sort result based on the two pairs to compare
 *
 * @param {Object} pairA the first pair to compare
 * @param {Object} pairB the second pair to compare
 * @returns {number} the order number
 */
export const sortIterablePair = (pairA, pairB) =>
  pairA.keyString > pairB.keyString ? 1 : pairA.keyString < pairB.keyString ? -1 : 0;

/**
 * @function getIterablePairs
 *
 * @description
 * get the pairs in the iterable for stringification
 *
 * @param {Map|Set} iterable the iterable to get the pairs for
 * @returns {Array<{key: string, value: any}>} the pairs
 */
export const getIterablePairs = (iterable) => {
  const pairs = [];
  const isMap = typeof iterable.get === 'function';

  iterable.forEach((value, key) => {
    pairs.push(
      isMap
        ? // eslint-disable-next-line no-use-before-define
        {key, keyString: stringify(key), value}
        : // eslint-disable-next-line no-use-before-define
        {key, keyString: stringify(key)}
    );
  });

  pairs.sort(sortIterablePair);

  const finalPairs = new Array(iterable.size);

  let pair;

  for (let index = 0; index < iterable.size; index++) {
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
export const getPrefixedValue = (tag, value) => `${tag}|${value}`;

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
  const objectKeys = keys(object);
  const newObject = {};

  objectKeys.sort();

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
 * @returns {any} the normalized value
 */
export const getNormalizedValue = (value) => {
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
    return getSortedObject(value);
  }

  if (TOSTRING_TAGS[tag]) {
    return getPrefixedValue(OBJECT_CLASS_MAP[tag], value.toString());
  }

  if (ITERABLE_TAGS[tag]) {
    return getIterablePairs(value);
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.DATE) {
    return getPrefixedValue(OBJECT_CLASS_MAP[tag], value.getTime());
  }

  if (tag === OBJECT_CLASS_TYPE_MAP.ERROR) {
    return getPrefixedValue(OBJECT_CLASS_MAP[tag], value.stack);
  }

  if (UNPARSEABLE_TAGS[tag]) {
    return getPrefixedValue(OBJECT_CLASS_MAP[tag], 'NOT_ENUMERABLE');
  }

  if (HTML_ELEMENT_REGEXP.test(tag)) {
    return getPrefixedValue(tag.slice(8, -1), getStringifiedElement(value));
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
 * @param {string} key the key for the value in the object
 * @param {any} value the value to normalize
 * @returns {any} the normalized value
 */
export const replacer = (key, value) => getNormalizedValue(value);

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
    ? fastStringify(value, replacer, null, getCircularValue)
    : getNormalizedValue(value);
}
