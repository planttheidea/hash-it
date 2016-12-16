import test from 'ava';

import * as types from '../src/constants';

const ARRAY = [1, 2, 3];
const OBJECTS = {
  array: ['foo', 'bar'],
  boolean: true,
  dataView: new DataView(new ArrayBuffer(2)),
  date: new Date(),
  error: new Error('Test'),
  float32Array: new Float32Array(ARRAY),
  float64Array: new Float64Array(ARRAY),
  'function': () => {},
  generator: function* () {},
  int8Array: new Int8Array(ARRAY),
  int16Array: new Int16Array(ARRAY),
  int32Array: new Int32Array(ARRAY),
  map: new Map().set('foo', 'bar'),
  math: Math,
  'null': null,
  number: 2,
  object: {foo: 'bar'},
  promise: Promise.resolve(1),
  regexp: /foo/,
  'set': new Set().add('foo'),
  string: 'string',
  symbol: Symbol('foo'),
  uint8Array: new Uint8Array(ARRAY),
  uint8ClampedArray: new Uint8ClampedArray(ARRAY),
  uint16Array: new Uint16Array(ARRAY),
  uint32Array: new Uint32Array(ARRAY),
  'undefined': undefined,
  weakMap: new WeakMap().set({}, 'bar'),
  weakSet: new WeakSet().add({foo:'bar'})
};

test('if types are correct string values', (t) => {
  t.is(types.ARRAY, '[object Array]');
  t.is(types.ARRAY_BUFFER, '[object ArrayBuffer]');
  t.is(types.DATA_VIEW, '[object DataView]');
  t.is(types.DATE, '[object Date]');
  t.is(types.ERROR, '[object Error]');
  t.is(types.FLOAT_32_ARRAY, '[object Float32Array]');
  t.is(types.FLOAT_64_ARRAY, '[object Float64Array]');
  t.is(types.GENERATOR, '[object GeneratorFunction]');
  t.is(types.INT_8_ARRAY, '[object Int8Array]');
  t.is(types.INT_16_ARRAY, '[object Int16Array]');
  t.is(types.INT_32_ARRAY, '[object Int32Array]');
  t.is(types.MAP, '[object Map]');
  t.is(types.MATH, '[object Math]');
  t.is(types.OBJECT, '[object Object]');
  t.is(types.PROMISE, '[object Promise]');
  t.is(types.REGEXP, '[object RegExp]');
  t.is(types.SET, '[object Set]');
  t.is(types.STRING, '[object String]');
  t.is(types.UINT_8_ARRAY, '[object Uint8Array]');
  t.is(types.UINT_8_CLAMPED_ARRAY, '[object Uint8ClampedArray]');
  t.is(types.UINT_16_ARRAY, '[object Uint16Array]');
  t.is(types.UINT_32_ARRAY, '[object Uint32Array]');
  t.is(types.WEAKMAP, '[object WeakMap]');
  t.is(types.WEAKSET, '[object WeakSet]');
});