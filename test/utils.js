import test from 'ava';
import sinon from 'sinon';

import {
  getIntegerHashValue,
  getStringifiedValue,
  getStringifiedValueWithRecursion,
  replacer
} from '../src/utils';

import json from '../src/prune';

const DATE = new Date();
const INTEGER_ARRAY = [1, 2, 3];
const TEST_VALUES = [
  {
    comparator: 'deepEqual',
    expectedResult: {},
    expectedString: '{}',
    key: '',
    value: {}
  }, {
    comparator: 'deepEqual',
    expectedResult: ['foo', 'bar'],
    expectedString: '{"0":"foo","1":"bar"}',
    key: 'arguments',
    value: (function() {
      return arguments;
    })('foo', 'bar')
  }, {
    comparator: 'deepEqual',
    expectedResult: ['foo', 'bar'],
    expectedString: '["foo","bar"]',
    key: 'array',
    value: ['foo', 'bar']
  }, {
    comparator: 'deepEqual',
    expectedResult: `ArrayBuffer \u0001\u0002\u0003`,
    expectedString: `ArrayBuffer \u0001\u0002\u0003`,
    key: 'arrayBuffer',
    value: new Uint16Array(INTEGER_ARRAY).buffer
  }, {
    comparator: 'is',
    expectedResult: true,
    expectedString: 'Boolean true',
    key: 'boolean',
    value: true
  }, {
    comparator: 'deepEqual',
    expectedResult: `DataView \u0000`,
    expectedString: `DataView \u0000`,
    key: 'dataView',
    value: new DataView(new ArrayBuffer(2))
  }, {
    comparator: 'is',
    expectedResult: `Date ${DATE.valueOf()}`,
    expectedString: `Date ${DATE.valueOf()}`,
    key: 'date',
    value: DATE
  }, {
    comparator: 'is',
    expectedResult: 'Error Error: test',
    expectedString: 'Error Error: test',
    key: 'error',
    value: new Error('test')
  }, {
    comparator: 'deepEqual',
    expectedResult: 'Float32Array 1,2,3',
    expectedString: 'Float32Array 1,2,3',
    key: 'float32Array',
    value: new Float32Array(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: 'Float64Array 1,2,3',
    expectedString: 'Float64Array 1,2,3',
    key: 'float64Array',
    value: new Float64Array(INTEGER_ARRAY)
  }, {
    comparator: 'is',
    expectedResult: 'function value(){}',
    expectedString: 'function value(){}',
    key: 'function',
    value: function() {}
  }, {
    comparator: 'is',
    expectedResult: 'function* value(){}',
    expectedString: 'function* value(){}',
    key: 'generator',
    value: function* () {}
  }, {
    comparator: 'deepEqual',
    expectedResult: 'Int8Array 1,2,3',
    expectedString: 'Int8Array 1,2,3',
    key: 'int8Array',
    value: new Int8Array(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: 'Int16Array 1,2,3',
    expectedString: 'Int16Array 1,2,3',
    key: 'int16Array',
    value: new Int16Array(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: 'Int32Array 1,2,3',
    expectedString: 'Int32Array 1,2,3',
    key: 'int32Array',
    value: new Int32Array(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: ['Map', ['foo', 'bar']],
    expectedString: '["Map",["foo","bar"]]',
    key: 'map',
    value: new Map().set('foo', 'bar')
  }, {
    comparator: 'deepEqual',
    expectedResult: {E: 2.718281828459045, LN2: 0.6931471805599453, LN10: 2.302585092994046, LOG2E: 1.4426950408889634, LOG10E: 0.4342944819032518, PI: 3.141592653589793, SQRT1_2: 0.7071067811865476, SQRT2: 1.4142135623730951},
    expectedString: '{"E":2.718281828459045,"LN2":0.6931471805599453,"LN10":2.302585092994046,"LOG2E":1.4426950408889634,"LOG10E":0.4342944819032518,"PI":3.141592653589793,"SQRT1_2":0.7071067811865476,"SQRT2":1.4142135623730951}',
    key: 'math',
    value: Math
  }, {
    comparator: 'is',
    expectedResult: 'Null null',
    expectedString: 'Null null',
    key: 'null',
    value: null
  }, {
    comparator: 'is',
    expectedResult: 12,
    expectedString: '12',
    key: 'number',
    value: 12
  }, {
    comparator: 'deepEqual',
    expectedResult: {foo: 'bar'},
    expectedString: '{"foo":"bar"}',
    key: 'object',
    value: {foo: 'bar'}
  }, {
    comparator: 'is',
    expectedResult: 'Promise NOT_ENUMERABLE',
    expectedString: 'Promise NOT_ENUMERABLE',
    key: 'promise',
    value: Promise.resolve(1)
  }, {
    comparator: 'is',
    expectedResult: 'RegExp /foo/',
    expectedString: 'RegExp /foo/',
    key: 'regexp',
    value: /foo/
  }, {
    comparator: 'deepEqual',
    expectedResult: ['Set', ['foo', 'foo']],
    expectedString: '["Set",["foo","foo"]]',
    key: 'set',
    value: new Set().add('foo')
  }, {
    comparator: 'is',
    expectedResult: 'foo',
    expectedString: 'foo',
    key: 'string',
    value: 'foo'
  }, {
    comparator: 'is',
    expectedResult: 'Symbol(foo)',
    expectedString: 'Symbol(foo)',
    key: 'symbol',
    value: Symbol('foo')
  }, {
    comparator: 'deepEqual',
    expectedResult: 'Uint8Array 1,2,3',
    expectedString: 'Uint8Array 1,2,3',
    key: 'uint8Array',
    value: new Uint8Array(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: 'Uint8ClampedArray 1,2,3',
    expectedString: 'Uint8ClampedArray 1,2,3',
    key: 'uint8ClampedArray',
    value: new Uint8ClampedArray(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: 'Uint16Array 1,2,3',
    expectedString: 'Uint16Array 1,2,3',
    key: 'uint16Array',
    value: new Uint16Array(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: 'Uint32Array 1,2,3',
    expectedString: 'Uint32Array 1,2,3',
    key: 'uint32Array',
    value: new Uint32Array(INTEGER_ARRAY)
  }, {
    comparator: 'is',
    expectedResult: 'Undefined undefined',
    expectedString: 'Undefined undefined',
    key: 'undefined',
    value: undefined
  }, {
    comparator: 'is',
    expectedResult: 'WeakMap NOT_ENUMERABLE',
    expectedString: 'WeakMap NOT_ENUMERABLE',
    key: 'weakMap',
    value: new WeakMap().set({}, 'foo')
  }, {
    comparator: 'is',
    expectedResult: 'WeakSet NOT_ENUMERABLE',
    expectedString: 'WeakSet NOT_ENUMERABLE',
    key: 'weakSet',
    value: new WeakSet().add({})
  }
];

test('if getIntegerHashValue returns correct values', (t) => {
  const undef = undefined;
  const nil = null;
  const string = 'foo';

  t.is(getIntegerHashValue(undef), 0);
  t.is(getIntegerHashValue(nil), 0);
  t.is(getIntegerHashValue(string), 193491849);
});

test('if replacer provides correct values for different object types', (t) => {
  TEST_VALUES.forEach(({comparator, expectedResult, key, value}) => {
    t[comparator](replacer(key, value), expectedResult);
  });
});

test('if getStringifiedValue uses JSON.stringify with replacer correctly', sinon.test(function(t) {
  TEST_VALUES.forEach(({comparator, expectedString, value}) => {
    t[comparator](getStringifiedValue(value), expectedString);
  });
}));

test('if getStringifiedValue throws for window object (deeply recursive)', sinon.test(function(t) {
  t.throws(() => {
    getStringifiedValue(window);
  });
}));

test('if getStringifiedValueWithRecursion handles deeply-recursive objects', sinon.test(function(t) {
  const spy = this.spy(json, 'prune');

  getStringifiedValueWithRecursion(window);

  t.true(spy.calledOnce);
}));