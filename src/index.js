// constants
import {EMPTY_VALUES} from './constants';

// utils
import {getIntegerHashValue, stringify} from './utils';

/**
 * @function hash
 *
 * @description
 * hash the value passed to a unique, consistent hash value
 *
 * @param {any} value the value to hash
 * @returns {number} the object hash
 */
export const hash = (value) => getIntegerHashValue(stringify(value));

/**
 * @function hash.is
 *
 * @description
 * create a comparator for the first object passed
 *
 * @param {any} object the object to test against
 * @returns {function(any): boolean} the method to test against the object
 */
hash.is = (object) => {
  const objectHash = hash(object);

  return (otherObject) => hash(otherObject) === objectHash;
};

/**
 * @function hash.isEqual
 *
 * @description
 * determine if all objects passed are equal in value to one another
 *
 * @param {...Array<any>} objects the objects to test for equality
 * @returns {boolean} are the objects equal
 */
hash.isEqual = (...objects) => {
  if (objects.length < 2) {
    // eslint-disable-next-line no-console
    console.error('isEqual requires at least two objects to be passed for comparison.');

    return false;
  }

  const isEqual = hash.is(objects.shift());

  for (let index = 0; index < objects.length; index++) {
    if (!isEqual(objects[index])) {
      return false;
    }
  }

  return true;
};

const EMPTY_HASHES = EMPTY_VALUES.reduce((hashes, value) => {
  hashes[hash(value)] = true;

  return hashes;
}, {});

/**
 * @function hash.isEmpty
 *
 * @description
 * determine if object is empty, meaning it is an array / object / map / set with values populated,
 * or is a string with no length, or is undefined or null
 *
 * @param {any} object the object to test
 * @returns {boolean} is the object empty
 */
hash.isEmpty = (object) => !!EMPTY_HASHES[hash(object)];

export default hash;
