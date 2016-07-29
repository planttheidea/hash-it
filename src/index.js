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

export default hash;
