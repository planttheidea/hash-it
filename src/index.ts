import { hash } from './hash';
import { stringify } from './stringify';

function all(value: any, ...otherValues: any[]) {
  return otherValues.every((otherValue) => is(value, otherValue));
}

function any(value: any, ...otherValues: any[]) {
  return otherValues.some((otherValue) => is(value, otherValue));
}

function is(value: any, otherValue: any): boolean {
  return hashIt(value) === hashIt(otherValue);
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
