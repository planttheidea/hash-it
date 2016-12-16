const objectToString = Object.prototype.toString;

/**
 * create the fake function args array for the stringified function
 *
 * @param {number} length
 * @returns {string}
 */
export const getFunctionArgs = (length) => {
  let string = '',
      index = -1;

  while (++index < length) {
    string += 'arg,';
  }

  return string.slice(0, -1);
};

/**
 * get the generic string value of the function passed
 *
 * @param {function} fn
 * @param {boolean} isGenerator=false
 * @returns {string}
 */
export const toFunctionString = (fn, isGenerator = false) => {
  return `function${isGenerator ? '*' : ''} ${fn.name || 'anonymous'}(${getFunctionArgs(fn.length)}){}`;
};

/**
 * get the toString value of object
 *
 * @param {*} object
 * @returns {string}
 */
export const toString = (object) => {
  return objectToString.call(object);
};
