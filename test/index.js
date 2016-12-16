import test from 'ava';

import hashIt from '../src/index';

const CONSISTENCY_ITERATIONS = 10000;

const DATE = new Date();
const INTEGER_ARRAY = [1, 2, 3];
const TEST_VALUES = [
  {
    key: 'arguments',
    value: (function() {
      return arguments;
    })('foo', 'bar')
  }, {
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
    key: 'promise',
    value: Promise.resolve(1)
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

test('if isEqual throws when only one argument is passed', (t) => {
  t.throws(() => {
    hashIt.isEqual({
      foo: 'bar'
    });
  });
});

test('if isUndefined checks if the object is undefined', (t) => {
  t.true(hashIt.isUndefined(undefined));
  t.false(hashIt.isUndefined('undefined'));
});

test('if isNull checks if the object is null', (t) => {
  t.true(hashIt.isNull(null));
  t.false(hashIt.isNull('null'));
});

test('if isEmpty checks if the object has value', (t) => {
  t.true(hashIt.isEmpty(null));
  t.true(hashIt.isEmpty(undefined));
  t.true(hashIt.isEmpty({}));
  t.true(hashIt.isEmpty(''));
  t.true(hashIt.isEmpty(0));
  t.true(hashIt.isEmpty([]));
  t.true(hashIt.isEmpty(new Map()));
  t.true(hashIt.isEmpty(new Set()));

  t.false(hashIt.isEmpty({foo: 'bar'}));
  t.false(hashIt.isEmpty(['foo']));
  t.false(hashIt.isEmpty(new Map().set({}, 'foo')));
  t.false(hashIt.isEmpty(new Set([1, 2])));
  t.false(hashIt.isEmpty(1));
  t.false(hashIt.isEmpty('foo'));
  t.false(hashIt.isEmpty(true));
});

test('if withRecursion gets the right value when value is recursive', (t) => {
  const foo = {
    bar: 'baz'
  };

  foo.baz = foo;

  const result = hashIt.withRecursion(foo);

  t.is(result, 2687538939);
});