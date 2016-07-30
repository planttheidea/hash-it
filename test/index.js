import test from 'ava';

import hashIt from '../src/index';

const CONSISTENCY_ITERATIONS = 10000;

const DATE = new Date();
const INTEGER_ARRAY = [1, 2, 3];
const TEST_VALUES = [
  {
    key: 'array',
    value: ['foo', 'bar']
  }, {
    key: 'arrayBuffer',
    value: new Uint16Array(INTEGER_ARRAY).buffer
  }, {
    key: 'boolean',
    value: true
  }, {
    key: 'dataView',
    value: new DataView(new ArrayBuffer(2))
  }, {
    key: 'date',
    value: DATE
  }, {
    key: 'error',
    value: new Error('test')
  }, {
    key: 'float32Array',
    value: new Float32Array(INTEGER_ARRAY)
  }, {
    key: 'float64Array',
    value: new Float64Array(INTEGER_ARRAY)
  }, {
    key: 'function',
    value: function() {}
  }, {
    key: 'generator',
    value: function* () {}
  }, {
    key: 'int8Array',
    value: new Int8Array(INTEGER_ARRAY)
  }, {
    key: 'int16Array',
    value: new Int16Array(INTEGER_ARRAY)
  }, {
    key: 'int32Array',
    value: new Int32Array(INTEGER_ARRAY)
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
    key: 'uint8Array',
    value: new Uint8Array(INTEGER_ARRAY)
  }, {
    key: 'uint8ClampedArray',
    value: new Uint8ClampedArray(INTEGER_ARRAY)
  }, {
    key: 'uint16Array',
    value: new Uint16Array(INTEGER_ARRAY)
  }, {
    key: 'uint32Array',
    value: new Uint32Array(INTEGER_ARRAY)
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

test('if hash is unique', (t) => {
  TEST_VALUES.forEach(({value}, index) => {
    TEST_VALUES.forEach(({value: otherValue}, otherIndex) => {
      if (index !== otherIndex) {
        t.not(value, otherValue);
      }
    });
  });
});

test('if hash is consistent', (t) => {
  let index = -1;

  while (++index < CONSISTENCY_ITERATIONS) {
    TEST_VALUES.forEach(({key, value}) => {
      t.is(hashIt(value), hashMap[key]);
    });
  }
});

test('if isEqual checks all objects for value equality based on hash', (t) => {

  const equalTest1 = {
    foo: 'bar'
  };
  const equalTest2 = {
    ...equalTest1
  };
  const equalTest3 = {
    ...equalTest2
  };

  const equalTest4 = {
    foo: 'baz'
  };

  t.not(equalTest1, equalTest2);
  t.true(hashIt.isEqual(equalTest1, equalTest2));

  t.not(equalTest1, equalTest3);
  t.true(hashIt.isEqual(equalTest1, equalTest3));
  t.true(hashIt.isEqual(equalTest2, equalTest3));

  t.not(equalTest1, equalTest3);
  t.false(hashIt.isEqual(equalTest1, equalTest4));

  t.true(hashIt.isEqual(equalTest1, equalTest2, equalTest3));
  t.false(hashIt.isEqual(equalTest1, equalTest2, equalTest4));
  t.false(hashIt.isEqual(equalTest2, equalTest3, equalTest4));
});