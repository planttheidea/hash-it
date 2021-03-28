// external dependencies
import { curry } from 'curriable';
// utils
import { getIntegerHashValue, stringify } from './utils';

/**
 * @function hash
 *
 * @description
 * hash the value passed to a unique, consistent hash value
 *
 * @param {any} value the value to hash
 * @returns {number} the object hash
 */
export function hash(value) {
  return getIntegerHashValue(stringify(value));
}

/**
 * @function hash.is
 *
 * @description
 * create a comparator for the first object passed to determine if the second is equal
 *
 * @param {any} object the object to test against
 * @returns {function(any): boolean} the method to test against the object
 */
hash.is = curry((object, otherObject) => hash(object) === hash(otherObject));

/**
 * @function hash.is.all
 *
 * @description
 * determine if all of the objects passed are equal in value to the first
 *
 * @param {...Array<any>} objects the objects to test for equality
 * @returns {boolean} are the objects equal
 */
hash.is.all = curry(function (objectBasis) {
  const isEqual = hash.is(objectBasis);

  for (let index = 1; index < arguments.length; ++index) {
    if (!isEqual(arguments[index])) {
      return false;
    }
  }

  return true;
}, 2);

/**
 * @function hash.is.any
 *
 * @description
 * determine if any of the objects passed are equal in value to the first
 *
 * @param {...Array<any>} objects the objects to test for equality
 * @returns {boolean} are the objects equal
 */
hash.is.any = curry(function (objectBasis) {
  const isEqual = hash.is(objectBasis);

  for (let index = 1; index < arguments.length; index++) {
    if (isEqual(arguments[index])) {
      return true;
    }
  }

  return false;
}, 2);

/**
 * @function hash.is.not
 *
 * @description
 * create a comparator for the first object passed to determine if the second is not equal
 *
 * @param {any} object the object to test against
 * @returns {function(any): boolean} the method to test against the object
 */
hash.is.not = curry(
  (object, otherObject) => hash(object) !== hash(otherObject),
);

export default hash;
