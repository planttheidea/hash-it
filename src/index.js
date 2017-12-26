import {getIntegerHashValue, getStringifiedValue} from './utils';

/**
 * @function hashIt
 *
 * @description
 * return the unique integer hash value for the object
 *
 * @param {*} object the object to hash
 * @param {boolean} [isCircular] is the object a circular object
 * @returns {number}
 */
const hashIt = (object, isCircular) => {
  const stringifiedValue = getStringifiedValue(object, isCircular);

  return getIntegerHashValue(stringifiedValue);
};

const UNDEFINED_HASH = hashIt(undefined);
const NULL_HASH = hashIt(null);
const EMPTY_ARRAY_HASH = hashIt([]);
const EMPTY_MAP_HASH = hashIt(new Map());
const EMPTY_NUMBER_HASH = hashIt(0);
const EMPTY_OBJECT_HASH = hashIt({});
const EMPTY_SET_HASH = hashIt(new Set());
const EMPTY_STRING_HASH = hashIt('');

const EMPTY_HASHES = {
  [EMPTY_ARRAY_HASH]: true,
  [EMPTY_MAP_HASH]: true,
  [EMPTY_NUMBER_HASH]: true,
  [EMPTY_OBJECT_HASH]: true,
  [EMPTY_SET_HASH]: true,
  [EMPTY_STRING_HASH]: true,
  [NULL_HASH]: true,
  [UNDEFINED_HASH]: true
};

/**
 * @function hashIt.isEqual
 *
 * @description
 * determine if all objects passed are equal in value to one another
 *
 * @param {...Array<*>} objects the objects to test for equality
 * @returns {boolean} are the objects equal
 */
hashIt.isEqual = (...objects) => {
  const length = objects.length;

  if (length === 1) {
    throw new Error('isEqual requires at least two objects to be passed for comparison.');
  }

  for (let index = 1; index < length; index++) {
    if (hashIt(objects[index - 1]) !== hashIt(objects[index])) {
      return false;
    }
  }

  return true;
};

/**
 * @function hashIt.isEmpty
 *
 * @description
 * determine if object is empty, meaning it is an array / object / map / set with values populated,
 * or is a string with no length, or is undefined or null
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object empty
 */
hashIt.isEmpty = (object) => {
  return !!EMPTY_HASHES[hashIt(object)];
};

/**
 * @function hashIt.isNull
 *
 * @description
 * determine if object is null
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object null
 */
hashIt.isNull = (object) => {
  return hashIt(object) === NULL_HASH;
};

/**
 * @function hashIt.isUndefined
 *
 * @description
 * determine if object is undefined
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object undefined
 */
hashIt.isUndefined = (object) => {
  return hashIt(object) === UNDEFINED_HASH;
};

export default hashIt;
