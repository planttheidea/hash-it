import {
  ARRAY,
  DATE,
  STRING,
  toFunctionString,
  toString
} from './toString';

// constants
import {
  DEFAULT_MAX_DEPTH,
  DEFAULT_ARRAY_MAX_LENGTH,
  DEFAULT_PRUNED_VALUE,
  ESCAPABLE,
  META,

  BOOLEAN_TYPEOF,
  FUNCTION_TYPEOF,
  NUMBER_TYPEOF,
  STRING_TYPEOF,
  UNDEFINED_TYPEOF
} from './constants';

/*
  This is a heavily modified and reduced version of JSON.prune provided by Canop
  at https://github.com/Canop/JSON.prune. All credit and praise should be directed
  there.
 */

let seen;

/**
 * iterates on enumerable own properties (default behavior)
 *
 * @param {object} object
 * @param {function} callback
 */
const forEachEnumerableOwnProperty = (object, callback) => {
  for (let key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      callback(key);
    }
  }
};

/**
 * return value surrounded by quotes, replacing escapable values
 *
 * @param {string} string
 * @returns {string}
 */
const quote = (string) => {
  ESCAPABLE.lastIndex = 0;

  let c;

  return !ESCAPABLE.test(string) ? `"${string}"` : `"${string.replace(ESCAPABLE, (a) => {
    c = META[a];

    return toString(c) === STRING ? c : `\\u${(`0000${a.charCodeAt(0).toString(16)}`).slice(-4)}`;
  })}"`;
};

/**
 * prune JSON for stringification
 *
 * @param {*} value
 * @returns {string}
 */
const prune = (value) => {
  seen = [];

  const pruneString = (key, holder, depthDecr) => {
    let value = holder[key],
        type = typeof value,
        partial = [],
        v;

    if (type === STRING_TYPEOF) {
      return quote(value);
    }

    if (type === BOOLEAN_TYPEOF || type === NUMBER_TYPEOF || type === UNDEFINED_TYPEOF) {
      return `${value}`;
    }

    if (type === FUNCTION_TYPEOF) {
      return toFunctionString(value);
    }

    if (!value) {
      return `${value}`;
    }

    const index = seen.indexOf(value);

    if (depthDecr <= 0 || !!~index) {
      return `${DEFAULT_PRUNED_VALUE}-${index}`;
    }

    type = toString(value);

    if (type === ARRAY) {
      seen.push(value);

      const length = Math.min(value.length, DEFAULT_ARRAY_MAX_LENGTH);

      let index = -1;

      while (++index < length) {
        partial[index] = pruneString(index, value, depthDecr - 1);
      }

      v = `[${partial.join(',')}]`;

      return v;
    }

    if (type === DATE) {
      return `${value.valueOf()}`;
    }

    seen.push(value);

    forEachEnumerableOwnProperty(value, (k) => {
      try {
        v = pruneString(k, value, depthDecr - 1);

        if (v) {
          partial.push(`${quote(k)}:${v}`);
        }
      } catch (exception) {
        // this try/catch due to forbidden accessors on some objects
      }
    });

    return `{${partial.join(',')}}`;
  };

  return pruneString('', {
    '': value
  }, DEFAULT_MAX_DEPTH);
};

export default {
  prune
};
