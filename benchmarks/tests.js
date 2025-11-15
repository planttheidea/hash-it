import { hash } from '../dist/esm/index.mjs';

function createHashTest(data) {
  return function hashTest(cycles) {
    let index = -1,
      val;

    while (++index < cycles) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      val = hash(data);
    }
  };
}

const boolean = true;
const infinite = Infinity;
const notANumber = NaN;
const nul = null;
const number = 123;
const string = 'foo';
const undef = undefined;

export const hashBoolean = createHashTest(boolean);
export const hashInfinity = createHashTest(infinite);
export const hashNaN = createHashTest(notANumber);
export const hashNull = createHashTest(nul);
export const hashNumber = createHashTest(number);
export const hashString = createHashTest(string);
export const hashUndefined = createHashTest(undef);

const array = [boolean, infinite, notANumber, nul, number, string, undef];
const circularObject = (() => {
  function Circular(value) {
    this.deeply = {
      nested: {
        reference: this,
        value,
      },
    };
  }

  return new Circular();
})();
const date = new Date(2000, 0, 1);
const error = new Error('boom');
const event = new Event('click');
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
const fn = function (_foo, _bar) {};
const map = new Map([
  ['foo', 'bar'],
  ['bar', 'baz'],
]);
const object = {
  boolean,
  infinite,
  notANumber,
  nul,
  number,
  string,
  undef,
};
const regExp = /foo/g;
const set = new Set(['foo', 'bar', 'baz']);

export const hashArray = createHashTest(array);
export const hashDate = createHashTest(date);
export const hashError = createHashTest(error);
export const hashEvent = createHashTest(event);
export const hashFunction = createHashTest(fn);
export const hashMap = createHashTest(map);
export const hashObject = createHashTest(object);
export const hashCircularObject = createHashTest(circularObject);
export const hashRegExp = createHashTest(regExp);
export const hashSet = createHashTest(set);
