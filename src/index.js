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

export default hash;
