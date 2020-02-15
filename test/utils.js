// test
import test from 'ava';
import sinon from 'sinon';
import { CIRCULAR_VALUE } from 'src/constants';
// src
import * as utils from 'src/utils';
import { ARRAYBUFFER, INTEGER_ARRAY, TEST_VALUES } from './data/values';


const getPrefixedValue = (prefix, value) => `${prefix}|${value}`;

test('if getFunctionName will return the function when there is a name property', (t) => {
  function foo() {}

  t.is(utils.getFunctionName(foo), foo.name);
});

test('if getFunctionName will return the function when there is no name property but has a derivable name', (t) => {
  function foo() {}

  delete foo.name;

  t.is(foo.name, '');
  t.is(utils.getFunctionName(foo), 'foo');
});

test('if getFunctionName will return the default name when there is no name property and no derivable name', (t) => {
  t.is(utils.getFunctionName(() => {}), 'anonymous');
});

test('if getIntegerHashValue returns correct value', (t) => {
  const string = 'foo';

  t.is(utils.getIntegerHashValue(string), 794144147649);
});

test('if shouldSort will return true of the first value is greater than the second', (t) => {
  const first = 'foo';
  const second = 'bar';

  const result = utils.shouldSort(first, second);

  t.true(result);
});

test('if shouldSort will return false of the first value is not greater than the second', (t) => {
  const first = 'bar';
  const second = 'foo';

  const result = utils.shouldSort(first, second);

  t.false(result);
});

test('if shouldSortPair will return true of the first index of the first value is greater than the second', (t) => {
  const first = ['foo'];
  const second = ['bar'];

  const result = utils.shouldSortPair(first, second);

  t.true(result);
});

test('if shouldSortPair will return false of the first index of the first value is not greater than the second', (t) => {
  const first = ['bar'];
  const second = ['foo'];

  const result = utils.shouldSortPair(first, second);

  t.false(result);
});

test('if sort will sort the array passed by the fn passed', (t) => {
  const array = ['foo', 'bar', 'baz'];
  const fn = (a, b) => a > b;

  const result = utils.sort(array, fn);

  t.is(array, result);
  t.deepEqual(array, ['bar', 'baz', 'foo']);
});

test('if getSortedIterablePairs will return the map pairs', (t) => {
  const iterable = new Map().set('foo', 'bar');

  const result = utils.getSortedIterablePairs(iterable);

  t.deepEqual(result, `Map|[[${[
    getPrefixedValue('string', 'foo'),
    getPrefixedValue('string', 'bar'),
  ].join(',')}]]`);
});

test('if getSortedIterablePairs will return the set pairs', (t) => {
  const iterable = new Set().add('foo');

  const result = utils.getSortedIterablePairs(iterable);

  t.deepEqual(result, `Set|[${getPrefixedValue('string', 'foo')}]`);
});

test('if getSortedIterablePairs will return the map pairs sorted by their keystring values', (t) => {
  const iterable = new Map().set('foo', 'bar').set('bar', 'baz');

  const result = utils.getSortedIterablePairs(iterable);

  t.deepEqual(result, `Map|[[${[
    getPrefixedValue('string', 'bar'), 
    getPrefixedValue('string', 'baz'),
  ].join(',')}],[${[
    getPrefixedValue('string', 'foo'), 
    getPrefixedValue('string', 'bar'),
  ].join(',')}]]`);
});

test('if getSortedIterablePairs will return the set pairs sorted by their keystring values', (t) => {
  const iterable = new Set().add('foo').add('bar');

  const result = utils.getSortedIterablePairs(iterable);

  t.deepEqual(result, `Set|[${[
    getPrefixedValue('string', 'bar'),
    getPrefixedValue('string', 'foo'),
  ].join(',')}]`);
});

test('if getSortedObject will get the object sorted by its keys', (t) => {
  /* eslint-disable */
  const object = {
    foo: 'bar',
    bar: 'baz',
    baz: 'quz',
  };
  /* eslint-enable */

  t.deepEqual(Object.keys(object), ['foo', 'bar', 'baz']);

  const result = utils.getSortedObject(object);

  t.deepEqual(result, object);
  t.notDeepEqual(Object.keys(object), Object.keys(result));

  t.deepEqual(Object.keys(result), ['bar', 'baz', 'foo']);
});

test.serial('if getStringifiedArrayBufferModern calls Buffer.from when there is support', (t) => {
  const stringified = 'stringified';
  const toString = sinon.stub().returns(stringified);

  const stub = sinon.stub(Buffer, 'from').returns({toString});

  const result = utils.getStringifiedArrayBufferModern(ARRAYBUFFER);

  t.true(Buffer.from.calledOnce);
  t.true(Buffer.from.calledWith(ARRAYBUFFER));

  t.true(toString.calledOnce);
  t.true(toString.calledWith('utf8'));

  stub.restore();

  t.is(result, stringified);
});

test.serial('if getStringifiedArrayBufferFallback creates a new Uint16Array when there is support', (t) => {
  const stringified = 'stringified';

  const stub = sinon.stub(String, 'fromCharCode').returns(stringified);

  const result = utils.getStringifiedArrayBufferFallback(ARRAYBUFFER);

  t.true(String.fromCharCode.calledOnce);
  t.deepEqual(String.fromCharCode.args[0], INTEGER_ARRAY);

  stub.restore();

  t.is(result, stringified);
});

test('if getStringifiedArrayBufferNoSupport will return an empty string', (t) => {
  const result = utils.getStringifiedArrayBufferNoSupport(ARRAYBUFFER);

  t.is(result, '');
});

test('if indexOf will return the index of the matching value in the array', (t) => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8];
  const value = 4;

  const result = utils.indexOf(array, value);

  t.is(result, 3);
});

test('if indexOf will return -1 if the value does not exist in the array', (t) => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8];
  const value = 40;

  const result = utils.indexOf(array, value);

  t.is(result, -1);
});

test('if getNormalizedValue will return the value passed if a string', (t) => {
  const value = 'string';
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, getPrefixedValue('string', value));
});

test('if getNormalizedValue will return the prefixed value passed if a primitive', (t) => {
  const value = true;
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, getPrefixedValue(typeof value, value));
});

test('if getNormalizedValue will return the prefixed value passed if null', (t) => {
  const value = null;
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, getPrefixedValue('null', value));
});

test('if getNormalizedValue will return the value passed if considered a "self" object', (t) => {
  const value = ['foo'];
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, value);
});

test('if getNormalizedValue will return the sorted value passed if an object', (t) => {
  const value = {
    bar: 'baz',
    foo: 'bar',
  };
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.not(result, value);
  t.deepEqual(result, utils.getSortedObject(value));
});

test('if getNormalizedValue will return the circular value if an object that has already been processed', (t) => {
  const value = {
    bar: 'baz',
    foo: 'bar',
  };
  const sortedCache = [];

  sortedCache.push(value);

  const result = utils.getNormalizedValue(value, sortedCache);

  t.not(result, value);
  t.deepEqual(result, CIRCULAR_VALUE);
});

test('if getNormalizedValue will return the toString value passed if toString must be called', (t) => {
  const value = Symbol('value');
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), value.toString()));
});

test('if getNormalizedValue will return the pairs value passed if an iterable', (t) => {
  const value = new Map().set('foo', 'bar').set('bar', 'baz');
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.deepEqual(result, utils.getSortedIterablePairs(value));
});

test('if getNormalizedValue will return the circular value if an iterable that has already been processed', (t) => {
  const value = new Map().set('foo', 'bar').set('bar', 'baz');
  const sortedCache = [];

  sortedCache.push(value);

  const result = utils.getNormalizedValue(value, sortedCache);

  t.deepEqual(result, CIRCULAR_VALUE);
});

test('if getNormalizedValue will return the epoch value passed if a date', (t) => {
  const value = new Date();
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), value.getTime()));
});

test('if getNormalizedValue will return the stack value passed if an error', (t) => {
  const value = new Error('boom');
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), value.stack));
});

test('if getNormalizedValue will return the placeholder value if not enumerable', (t) => {
  const value = new Promise(() => {});
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), 'NOT_ENUMERABLE'));
});

test('if getNormalizedValue will return the HTML tag with attributes if an HTML element', (t) => {
  const value = document.createElement('main');

  value.className = 'className';
  value.id = 'id';

  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), value.outerHTML));
});

test('if getNormalizedValue will return the joined value if a typed array', (t) => {
  const value = new Uint16Array([1, 2, 3]);
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), value.join(',')));
});

test('if getNormalizedValue will return the stringified buffer value if an array buffer', (t) => {
  const value = ARRAYBUFFER;
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(
    result,
    getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), utils.getStringifiedArrayBuffer(value))
  );
});

test('if getNormalizedValue will return the stringified buffer value if a dataview', (t) => {
  const value = new DataView(ARRAYBUFFER);
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(
    result,
    getPrefixedValue(
      Object.prototype.toString.call(value).slice(8, -1),
      utils.getStringifiedArrayBuffer(value.buffer)
    )
  );
});

test('if getNormalizedValue will return the value itself if not matching', (t) => {
  class Foo {
    constructor(value) {
      this.value = value;

      return this;
    }

    get [Symbol.toStringTag]() {
      return 'Foo';
    }
  }

  const value = new Foo('bar');
  const sortedCache = [];

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, value);
});

test('if createReplacer provides correct values for different object types', (t) => {
  const sortedCache = [];

  const replacer = utils.createReplacer(sortedCache).bind(TEST_VALUES);

  TEST_VALUES.forEach(({comparator, expectedResult, key, value}) => {
    t[comparator](replacer(key, value), expectedResult, key);
  });
});

test('if stringify uses JSON.stringify with createReplacer correctly', (t) => {
  TEST_VALUES.forEach(({comparator, expectedString, value}) => {
    t[comparator](utils.stringify(value), expectedString);
  });
});

test('if stringify handles deeply-recursive objects', (t) => {
  try {
    utils.stringify(window);

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});
