import {
  getIntegerHashValue,
  stringify
} from './utils';

/**
 * return the unique integer hash value for the object
 *
 * @param {*} object
 * @returns {number}
 */
const hashIt = (object) => {
  return getIntegerHashValue(stringify(object));
};

const UNDEFINED_HASH = hashIt(undefined);
const NULL_HASH = hashIt(null);
const EMPTY_ARRAY_HASH = hashIt([]);
const EMPTY_MAP_HASH = hashIt(new Map());
const EMPTY_NUMBER_HASH = hashIt(0);
const EMPTY_OBJECT_HASH = hashIt({});
const EMPTY_SET_HASH = hashIt(new Set());
const EMPTY_STRING_HASH = hashIt('');

/**
 * determine if all objects passed are equal in value to one another
 *
 * @param {array<*>} objects
 * @returns {boolean}
 */
hashIt.isEqual = (...objects) => {
  const length = objects.length;

  if (length === 1) {
    throw new Error('isEqual requires at least two objects to be passed for comparison.');
  }

  let index = 0;

  while (++index < length) {
    if (hashIt(objects[index - 1]) !== hashIt(objects[index])) {
      return false;
    }
  }

  return true;
};

/**
 * determine if object is empty, meaning it is an array / object / map / set with values populated,
 * or is a string with no length, or is undefined or null
 *
 * @param {*} object
 * @returns {boolean}
 */
hashIt.isEmpty = (object) => {
  const objectHash = hashIt(object);

  return objectHash === UNDEFINED_HASH ||
      objectHash === NULL_HASH ||
      objectHash === EMPTY_ARRAY_HASH ||
      objectHash === EMPTY_MAP_HASH ||
      objectHash === EMPTY_NUMBER_HASH ||
      objectHash === EMPTY_OBJECT_HASH ||
      objectHash === EMPTY_SET_HASH ||
      objectHash === EMPTY_STRING_HASH;
};

/**
 * determine if object is null
 *
 * @param {*} object
 * @returns {boolean}
 */
hashIt.isNull = (object) => {
  return hashIt(object) === NULL_HASH;
};

/**
 * determine if object is undefined
 *
 * @param {*} object
 * @returns {boolean}
 */
hashIt.isUndefined = (object) => {
  return hashIt(object) === UNDEFINED_HASH;
};

export default hashIt;
