import test from 'ava';

import {
  toFunctionString,
  toString,
  types
} from '../src/toString';

const ARRAY = [1, 2, 3];
const OBJECTS = {
  array: ['foo', 'bar'],
  boolean: true,
  date: new Date(),
  error: new Error('Test'),
  float32Array: new Float32Array(ARRAY),
  float64Array: new Float64Array(ARRAY),
  'function': () => {},
  int8Array: new Int8Array(ARRAY),
  int16Array: new Int16Array(ARRAY),
  int32Array: new Int32Array(ARRAY),
  map: new Map().set('foo', 'bar'),
  math: Math,
  'null': null,
  number: 2,
  object: {foo: 'bar'},
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
  t.is(types.BOOLEAN, '[object Boolean]');
  t.is(types.DATE, '[object Date]');
  t.is(types.ERROR, '[object Error]');
  t.is(types.FLOAT_32_ARRAY, '[object Float32Array]');
  t.is(types.FLOAT_64_ARRAY, '[object Float64Array]');
  t.is(types.FUNCTION, '[object Function]');
  t.is(types.INT_8_ARRAY, '[object Int8Array]');
  t.is(types.INT_16_ARRAY, '[object Int16Array]');
  t.is(types.INT_32_ARRAY, '[object Int32Array]');
  t.is(types.MAP, '[object Map]');
  t.is(types.MATH, '[object Math]');
  t.is(types.NULL, '[object Null]');
  t.is(types.NUMBER, '[object Number]');
  t.is(types.OBJECT, '[object Object]');
  t.is(types.REGEXP, '[object RegExp]');
  t.is(types.SET, '[object Set]');
  t.is(types.STRING, '[object String]');
  t.is(types.SYMBOL, '[object Symbol]');
  t.is(types.UINT_8_ARRAY, '[object Uint8Array]');
  t.is(types.UINT_8_CLAMPED_ARRAY, '[object Uint8ClampedArray]');
  t.is(types.UINT_16_ARRAY, '[object Uint16Array]');
  t.is(types.UINT_32_ARRAY, '[object Uint32Array]');
  t.is(types.UNDEFINED, '[object Undefined]');
  t.is(types.WEAKMAP, '[object WeakMap]');
  t.is(types.WEAKSET, '[object WeakSet]');
});

test('if toString correctly identifies to object class values', (t) => {
  t.is(toString(OBJECTS.array), types.ARRAY);
  t.is(toString(OBJECTS.boolean), types.BOOLEAN);
  t.is(toString(OBJECTS.date), types.DATE);
  t.is(toString(OBJECTS.error), types.ERROR);
  t.is(toString(OBJECTS.float32Array), types.FLOAT_32_ARRAY);
  t.is(toString(OBJECTS.float64Array), types.FLOAT_64_ARRAY);
  t.is(toString(OBJECTS.function), types.FUNCTION);
  t.is(toString(OBJECTS.int8Array), types.INT_8_ARRAY);
  t.is(toString(OBJECTS.int16Array), types.INT_16_ARRAY);
  t.is(toString(OBJECTS.int32Array), types.INT_32_ARRAY);
  t.is(toString(OBJECTS.map), types.MAP);
  t.is(toString(OBJECTS.math), types.MATH);
  t.is(toString(OBJECTS.null), types.NULL);
  t.is(toString(OBJECTS.number), types.NUMBER);
  t.is(toString(OBJECTS.object), types.OBJECT);
  t.is(toString(OBJECTS.regexp), types.REGEXP);
  t.is(toString(OBJECTS.set), types.SET);
  t.is(toString(OBJECTS.string), types.STRING);
  t.is(toString(OBJECTS.symbol), types.SYMBOL);
  t.is(toString(OBJECTS.uint8Array), types.UINT_8_ARRAY);
  t.is(toString(OBJECTS.uint8ClampedArray), types.UINT_8_CLAMPED_ARRAY);
  t.is(toString(OBJECTS.uint16Array), types.UINT_16_ARRAY);
  t.is(toString(OBJECTS.uint32Array), types.UINT_32_ARRAY);
  t.is(toString(OBJECTS.undefined), types.UNDEFINED);
  t.is(toString(OBJECTS.weakMap), types.WEAKMAP);
  t.is(toString(OBJECTS.weakSet), types.WEAKSET);
});

test('if toFunctionString correct creates the abbreviated string expected', (t) => {
  const expectedSimpleString = 'function anonymous(){}';
  const expectedComplexString = 'function complexFunc(arg,arg,arg,arg,arg){}';
  const expectedComplexArrowString = 'function complexFuncArrow(arg,arg,arg,arg,arg){}';

  function complexFunc(arg1, arg2, arg3, arg4, arg5) {
    console.log(arg1, arg2, arg3, arg4, arg5);
  }

  const complexFuncArrow = (arg1, arg2, arg3, arg4, arg5) => {
    console.log(arg1, arg2, arg3, arg4, arg5);
  };

  t.is(toFunctionString(() => {}), expectedSimpleString);
  t.is(toFunctionString(function() {}), expectedSimpleString);
  t.is(toFunctionString(complexFunc), expectedComplexString);
  t.is(toFunctionString(complexFuncArrow), expectedComplexArrowString);
});