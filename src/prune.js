import {
  toFunctionString,
  toString,
  types
} from './toString';

/*
  This is a heavily modified and reduced version of JSON.prune provided by Canop
  at https://github.com/Canop/JSON.prune. All credit and praise should be directed
  there.
 */

const DEFAULT_MAX_DEPTH = 6;
const DEFAULT_ARRAY_MAX_LENGTH = 50;
const DEFAULT_PRUNED_VALUE = '*Recursive';
const ESCAPABLE = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
const META = {	// table of character substitutions
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\f': '\\f',
  '\r': '\\r',
  '"' : '\\"',
  '\\': '\\\\'
};

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

    return toString(c) === types.STRING ? c : `\\u${(`0000${a.charCodeAt(0).toString(16)}`).slice(-4)}`;
  })}"`;
};

/**
 * prune JSON for stringification
 *
 * @param {any} value
 * @returns {string}
 */
const prune = (value) => {
  seen = [];

  const pruneString = (key, holder, depthDecr) => {
    let value = holder[key],
        partial = [],
        v;

    switch (typeof value) {
      case 'string':
        return quote(value);

      case 'boolean':
      case 'null':
      case 'number':
      case 'undefined':
        return `${value}`;

      case 'function':
        return toFunctionString(value);

      case 'object':
        if (!value) {
          return `${value}`;
        }

        const index = seen.indexOf(value);

        if (depthDecr <= 0 || !!~index) {
          return `${DEFAULT_PRUNED_VALUE}-${index}`;
        }

        switch (toString(value)) {
          case types.ARRAY:
            seen.push(value);

            const length = Math.min(value.length, DEFAULT_ARRAY_MAX_LENGTH);

            let index = -1;

            while (++index < length) {
              partial[index] = pruneString(index, value, depthDecr - 1);
            }

            v = `[${partial.join(',')}]`;

            return v;

          case types.DATE:
            return `${value.valueOf()}`;

          default:
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
        }
    }
  };

  return pruneString('', {
    '': value
  }, DEFAULT_MAX_DEPTH);
};

export default {
  prune
};
