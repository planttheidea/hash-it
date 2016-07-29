import test from 'ava';
import sinon from 'sinon';

import {
  getIntegerHashValue,
  replacer,
  stringify
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
    expectedString: '["foo","bar"]',
    key: 'array',
    value: ['foo', 'bar']
  }, {
    comparator: 'deepEqual',
    expectedResult: new Uint16Array(INTEGER_ARRAY).buffer,
    expectedString: `"\\u0001\\u0002\\u0003"`,
    key: 'arrayBuffer',
    value: new Uint16Array(INTEGER_ARRAY).buffer
  }, {
    comparator: 'is',
    expectedResult: true,
    expectedString: 'true',
    key: 'boolean',
    value: true
  }, {
    comparator: 'is',
    expectedResult: `${DATE.valueOf()}`,
    expectedString: `"${DATE.valueOf()}"`,
    key: 'date',
    value: DATE
  }, {
    comparator: 'is',
    expectedResult: 'Error: test',
    expectedString: '"Error: test"',
    key: 'error',
    value: new Error('test')
  }, {
    comparator: 'deepEqual',
    expectedResult: new Float32Array(INTEGER_ARRAY),
    expectedString: '"Float32Array [1,2,3]"',
    key: 'float32Array',
    value: new Float32Array(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: new Float64Array(INTEGER_ARRAY),
    expectedString: '"Float64Array [1,2,3]"',
    key: 'float64Array',
    value: new Float64Array(INTEGER_ARRAY)
  }, {
    comparator: 'is',
    expectedResult: 'function value(){}',
    expectedString: '"function value(){}"',
    key: 'function',
    value: function() {}
  }, {
    comparator: 'deepEqual',
    expectedResult: new Int8Array(INTEGER_ARRAY),
    expectedString: '"Int8Array [1,2,3]"',
    key: 'int8Array',
    value: new Int8Array(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: new Int16Array(INTEGER_ARRAY),
    expectedString: '"Int16Array [1,2,3]"',
    key: 'int16Array',
    value: new Int16Array(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: new Int32Array(INTEGER_ARRAY),
    expectedString: '"Int32Array [1,2,3]"',
    key: 'int32Array',
    value: new Int32Array(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: [['foo', 'bar']],
    expectedString: '[["foo","bar"]]',
    key: 'map',
    value: new Map().set('foo', 'bar')
  }, {
    comparator: 'is',
    expectedResult: 'Math--NOT_ENUMERABLE',
    expectedString: '"Math--NOT_ENUMERABLE"',
    key: 'math',
    value: Math
  }, {
    comparator: 'is',
    expectedResult: 'null',
    expectedString: '"null"',
    key: 'null',
    value: null
  }, {
    comparator: 'is',
    expectedResult: 12,
    expectedString: '"12"',
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
    expectedResult: '/foo/',
    expectedString: '"/foo/"',
    key: 'regexp',
    value: /foo/
  }, {
    comparator: 'deepEqual',
    expectedResult: [['foo', 'foo']],
    expectedString: '[["foo","foo"]]',
    key: 'set',
    value: new Set().add('foo')
  }, {
    comparator: 'is',
    expectedResult: 'foo',
    expectedString: '"foo"',
    key: 'string',
    value: 'foo'
  }, {
    comparator: 'is',
    expectedResult: 'Symbol(foo)',
    expectedString: '"Symbol(foo)"',
    key: 'symbol',
    value: Symbol('foo')
  }, {
    comparator: 'deepEqual',
    expectedResult: new Uint8Array(INTEGER_ARRAY),
    expectedString: '"Uint8Array [1,2,3]"',
    key: 'uint8Array',
    value: new Uint8Array(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: new Uint8ClampedArray(INTEGER_ARRAY),
    expectedString: '"Uint8ClampedArray [1,2,3]"',
    key: 'uint8ClampedArray',
    value: new Uint8ClampedArray(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: new Uint16Array(INTEGER_ARRAY),
    expectedString: '"Uint16Array [1,2,3]"',
    key: 'uint16Array',
    value: new Uint16Array(INTEGER_ARRAY)
  }, {
    comparator: 'deepEqual',
    expectedResult: new Uint32Array(INTEGER_ARRAY),
    expectedString: '"Uint32Array [1,2,3]"',
    key: 'uint32Array',
    value: new Uint32Array(INTEGER_ARRAY)
  }, {
    comparator: 'is',
    expectedResult: 'undefined',
    expectedString: '"undefined"',
    key: 'undefined',
    value: undefined
  }, {
    comparator: 'is',
    expectedResult: 'WeakMap--NOT_ENUMERABLE',
    expectedString: '"WeakMap--NOT_ENUMERABLE"',
    key: 'weakMap',
    value: new WeakMap().set({}, 'foo')
  }, {
    comparator: 'is',
    expectedResult: 'WeakSet--NOT_ENUMERABLE',
    expectedString: '"WeakSet--NOT_ENUMERABLE"',
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
  t.is(getIntegerHashValue(string), 193420387);
});

test('if replacer provides correct values for different object types', (t) => {
  TEST_VALUES.forEach(({comparator, expectedResult, key, value}) => {
    t[comparator](replacer(key, value), expectedResult);
  });
});

test('if stringify uses JSON.stringify with replacer correctly, and falls back to prune when needed', sinon.test(function(t) {
  const spy = this.spy(json, 'prune');

  TEST_VALUES.forEach(({comparator, expectedString, value}) => {
    t[comparator](stringify(value), expectedString);
  });

  stringify(window);

  t.true(spy.calledOnce);
}));