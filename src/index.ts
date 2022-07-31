import hash from './hash';
import stringify from './stringify';

function is(value: any, otherValue: any): boolean {
  return hashIt(value) === hashIt(otherValue);
}

function all(value: any, ...otherValues: any[]) {
  for (let index = 0; index < otherValues.length; ++index) {
    if (not(value, otherValues[index])) {
      return false;
    }
  }

  return true;
}

function any(value: any, ...otherValues: any[]) {
  for (let index = 0; index < otherValues.length; ++index) {
    if (is(value, otherValues[index])) {
      return true;
    }
  }

  return false;
}

function not(value: any, otherValue: any) {
  return hashIt(value) !== hashIt(otherValue);
}

is.all = all;
is.any = any;
is.not = not;

function hashIt(value: any): number {
  return hash(stringify(value));
}

hashIt.is = is;

export default hashIt;
