import test from 'ava';

import * as constants from '../src/constants';
import {
  getFunctionArgs,
  toFunctionString,
  toString
} from '../src/toString';

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

test('if getFunctionArgs returns the correct string based on the length passed', (t) => {
  const one = 'arg';
  const three = 'arg,arg,arg';
  const five = 'arg,arg,arg,arg,arg';

  t.is(getFunctionArgs(1), one);
  t.is(getFunctionArgs(3), three);
  t.is(getFunctionArgs(5), five);
});

test('if toString correctly identifies to object class values', (t) => {
  t.is(toString(OBJECTS.array), constants.ARRAY);
  t.is(toString(OBJECTS.dataView), constants.DATA_VIEW);
  t.is(toString(OBJECTS.date), constants.DATE);
  t.is(toString(OBJECTS.error), constants.ERROR);
  t.is(toString(OBJECTS.float32Array), constants.FLOAT_32_ARRAY);
  t.is(toString(OBJECTS.float64Array), constants.FLOAT_64_ARRAY);
  t.is(toString(OBJECTS.generator), constants.GENERATOR);
  t.is(toString(OBJECTS.int8Array), constants.INT_8_ARRAY);
  t.is(toString(OBJECTS.int16Array), constants.INT_16_ARRAY);
  t.is(toString(OBJECTS.int32Array), constants.INT_32_ARRAY);
  t.is(toString(OBJECTS.map), constants.MAP);
  t.is(toString(OBJECTS.math), constants.MATH);
  t.is(toString(OBJECTS.object), constants.OBJECT);
  t.is(toString(OBJECTS.promise), constants.PROMISE);
  t.is(toString(OBJECTS.regexp), constants.REGEXP);
  t.is(toString(OBJECTS.set), constants.SET);
  t.is(toString(OBJECTS.string), constants.STRING);
  t.is(toString(OBJECTS.uint8Array), constants.UINT_8_ARRAY);
  t.is(toString(OBJECTS.uint8ClampedArray), constants.UINT_8_CLAMPED_ARRAY);
  t.is(toString(OBJECTS.uint16Array), constants.UINT_16_ARRAY);
  t.is(toString(OBJECTS.uint32Array), constants.UINT_32_ARRAY);
  t.is(toString(OBJECTS.weakMap), constants.WEAKMAP);
  t.is(toString(OBJECTS.weakSet), constants.WEAKSET);
});

test('if toFunctionString correct creates the abbreviated string expected', (t) => {
  const expectedSimpleString = 'function anonymous(){}';
  const expectedComplexString = 'function complexFunc(arg,arg,arg,arg,arg){}';
  const expectedComplexArrowString = 'function complexFuncArrow(arg,arg,arg,arg,arg){}';
  const expectedGeneratorString = 'function* generatorFunc(){}';

  function complexFunc(arg1, arg2, arg3, arg4, arg5) {
    console.log(arg1, arg2, arg3, arg4, arg5);
  }

  const complexFuncArrow = (arg1, arg2, arg3, arg4, arg5) => {
    console.log(arg1, arg2, arg3, arg4, arg5);
  };

  function* generatorFunc() {
    let counter = 0;

    yield ++counter;
  }

  t.is(toFunctionString(() => {}), expectedSimpleString);
  t.is(toFunctionString(function() {}), expectedSimpleString);
  t.is(toFunctionString(complexFunc), expectedComplexString);
  t.is(toFunctionString(complexFuncArrow), expectedComplexArrowString);
  t.is(toFunctionString(generatorFunc, true), expectedGeneratorString);
});