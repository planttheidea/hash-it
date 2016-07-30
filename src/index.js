import {
  getIntegerHashValue,
  stringify
} from './utils';

/**
 * return the unique integer hash value for the object
 *
 * @param {any} object
 * @returns {number}
 */
const hash = (object) => {
  return getIntegerHashValue(stringify(object));
};

const UNDEFINED_HASH = hash(undefined);

const NULL_HASH = hash(null);

const EMPTY_ARRAY_HASH = hash([]);
const EMPTY_MAP_HASH = hash(new Map());
const EMPTY_NUMBER_HASH = hash(0);
const EMPTY_OBJECT_HASH = hash({});
const EMPTY_SET_HASH = hash(new Set());
const EMPTY_STRING_HASH = hash('');

/**
 * determine if all objects passed are equal in value to one another
 *
 * @param {array<any>} objects
 * @returns {boolean}
 */
hash.isEqual = (...objects) => {
  const length = objects.length;

  if (length === 1) {
    throw new Error('isEqual requires at least two objects to be passed for comparison.');
  }

  let index = 0;

  while (++index < length) {
    if (hash(objects[index - 1]) !== hash(objects[index])) {
      return false;
    }
  }

  return true;
};

/**
 * determine if object is empty, meaning it is an array / object / map / set with values populated,
 * or is a string with no length, or is undefined or null
 *
 * @param {any} object
 * @returns {boolean}
 */
hash.isEmpty = (object) => {
  const objectHash = hash(object);

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
 * @param {any} object
 * @returns {boolean}
 */
hash.isNull = (object) => {
  return hash(object) === NULL_HASH;
};

/**
 * determine if object is undefined
 *
 * @param {any} object
 * @returns {boolean}
 */
hash.isUndefined = (object) => {
  return hash(object) === UNDEFINED_HASH;
};

export default hash;
