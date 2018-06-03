// utils
import {getIntegerHashValue, stringify} from './utils';

/**
 * @function hashIt
 *
 * @description
 * hash the value passed to a unique, consistent hash value
 *
 * @param {any} value the value to hash
 * @param {Object} [options={}] the options for derivation
 * @returns {number} the object hash
 */
export const hashIt = (value, options = {}) => getIntegerHashValue(stringify(value, options));

const NULL_HASH = hashIt(null);
const UNDEFINED_HASH = hashIt(undefined);

const EMPTY_HASHES = {
  [hashIt([])]: true,
  [hashIt(new Map())]: true,
  [NULL_HASH]: true,
  [hashIt({})]: true,
  [hashIt(new Set())]: true,
  [hashIt('')]: true,
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
hashIt.isEmpty = (object) => !!EMPTY_HASHES[hashIt(object)];

/**
 * @function hashIt.isNull
 *
 * @description
 * determine if object is null
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object null
 */
hashIt.isNull = (object) => hashIt(object) === NULL_HASH;

/**
 * @function hashIt.isUndefined
 *
 * @description
 * determine if object is undefined
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object undefined
 */
hashIt.isUndefined = (object) => hashIt(object) === UNDEFINED_HASH;

export default hashIt;
