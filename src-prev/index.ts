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

function isAll(value: any, ...otherValues: any[]) {
  for (let index = 0; index < otherValues.length; ++index) {
    if (!is(value, otherValues[index])) {
      return false;
    }
  }

  return true;
}

function isAny(value: any, ...otherValues: any[]) {
  for (let index = 0; index < otherValues.length; ++index) {
    if (is(value, otherValues[index])) {
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
