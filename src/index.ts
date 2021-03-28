import getUniqueIntegerFromString from './hash';
import stringify from './stringify';

/**
 * hash the value passed to a unique, consistent hash value
 *
 * @param value the value to hash
 * @returns the object hash
 */
function hash(value: any) {
  return getUniqueIntegerFromString(stringify(value));
}

function is(value: any, otherValue: any) {
  return hash(value) === hash(otherValue);
}

function isAll(value: any, otherValue: any) {
  const comparisonValues = arguments.length - 1;

  if (comparisonValues === 1) {
    return is(value, otherValue);
  }

  for (let index = 0; index < comparisonValues; ++index) {
    if (!is(value, arguments[index + 1])) {
      return false;
    }
  }

  return true;
}

function isAny(value: any, otherValue: any) {
  const comparisonValues = arguments.length - 1;

  if (comparisonValues === 1) {
    return is(value, otherValue);
  }

  for (let index = 0; index < comparisonValues; ++index) {
    if (is(value, arguments[index + 1])) {
      return true;
    }
  }

  return false;
}

function isNot(value: any, otherValue: any) {
  return hash(value) !== hash(otherValue);
}

is.all = isAll;
is.any = isAny;
is.not = isNot;

hash.is = is;

export default hash;
