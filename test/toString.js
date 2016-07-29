import test from 'ava';

import {
  toFunctionString,
  toString,
  types
} from '../src/toString';

const OBJECTS = {
  array: ['foo', 'bar'],
  boolean: true,
  date: new Date(),
  error: new Error('Test'),
  'function': () => {},
  map: new Map().set('foo', 'bar'),
  math: Math,
  'null': null,
  number: 2,
  object: {foo: 'bar'},
  regexp: /foo/,
  'set': new Set().add('foo'),
  string: 'string',
  symbol: Symbol('foo'),
  'undefined': undefined,
  weakMap: new WeakMap().set({}, 'bar'),
  weakSet: new WeakSet().add({foo:'bar'})
};

test('if types are correct string values', (t) => {
  t.is(types.ARRAY, '[object Array]');
  t.is(types.BOOLEAN, '[object Boolean]');
  t.is(types.DATE, '[object Date]');
  t.is(types.ERROR, '[object Error]');
  t.is(types.FUNCTION, '[object Function]');
  t.is(types.MAP, '[object Map]');
  t.is(types.MATH, '[object Math]');
  t.is(types.NULL, '[object Null]');
  t.is(types.NUMBER, '[object Number]');
  t.is(types.OBJECT, '[object Object]');
  t.is(types.REGEXP, '[object RegExp]');
  t.is(types.SET, '[object Set]');
  t.is(types.STRING, '[object String]');
  t.is(types.SYMBOL, '[object Symbol]');
  t.is(types.UNDEFINED, '[object Undefined]');
  t.is(types.WEAKMAP, '[object WeakMap]');
  t.is(types.WEAKSET, '[object WeakSet]');
});

test('if toString correctly identifies to object class values', (t) => {
  t.is(toString(OBJECTS.array), types.ARRAY);
  t.is(toString(OBJECTS.boolean), types.BOOLEAN);
  t.is(toString(OBJECTS.date), types.DATE);
  t.is(toString(OBJECTS.error), types.ERROR);
  t.is(toString(OBJECTS.function), types.FUNCTION);
  t.is(toString(OBJECTS.map), types.MAP);
  t.is(toString(OBJECTS.math), types.MATH);
  t.is(toString(OBJECTS.null), types.NULL);
  t.is(toString(OBJECTS.number), types.NUMBER);
  t.is(toString(OBJECTS.object), types.OBJECT);
  t.is(toString(OBJECTS.regexp), types.REGEXP);
  t.is(toString(OBJECTS.set), types.SET);
  t.is(toString(OBJECTS.string), types.STRING);
  t.is(toString(OBJECTS.symbol), types.SYMBOL);
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