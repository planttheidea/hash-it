import test from 'ava';

import hashIt from '../src/index';

const CONSISTENCY_ITERATIONS = 10000;

const DATE = new Date();
const TEST_VALUES = [
  {
    key: 'array',
    value: ['foo', 'bar']
  }, {
    key: 'boolean',
    value: true
  }, {
    key: 'date',
    value: DATE
  }, {
    key: 'error',
    value: new Error('test')
  }, {
    key: 'function',
    value: function() {}
  }, {
    key: 'map',
    value: new Map().set('foo', 'bar')
  }, {
    key: 'math',
    value: Math
  }, {
    key: 'null',
    value: null
  }, {
    key: 'number',
    value: 12
  }, {
    key: 'object',
    value: {foo: 'bar'}
  }, {
    key: 'regexp',
    value: /foo/
  }, {
    key: 'set',
    value: new Set().add('foo')
  }, {
    key: 'string',
    value: 'foo'
  }, {
    key: 'symbol',
    value: Symbol('foo')
  }, {
    key: 'undefined',
    value: undefined
  }, {
    key: 'weakMap',
    value: new WeakMap().set({}, 'foo')
  }, {
    key: 'weakSet',
    value: new WeakSet().add({})
  }
];

test('if hashed values are non-zero', (t) => {
  TEST_VALUES.forEach(({value}) => {
    t.not(hashIt(value), 0);
  });
});

let hashMap = {};

TEST_VALUES.forEach(({key, value}) => {
  hashMap[key] = hashIt(value);
});

test('if hash is consistent', (t) => {
  let index = -1;

  while (++index < CONSISTENCY_ITERATIONS) {
    TEST_VALUES.forEach(({key, value}) => {
      t.is(hashIt(value), hashMap[key]);
    });
  }
});