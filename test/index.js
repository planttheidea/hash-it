// test
import test from 'ava';
import sinon from 'sinon';
import uuid from 'uuid/v4';

// test data
import WORDS from 'test/data/words.json';

//src
import hash from 'src/index';

const CONSISTENCY_ITERATIONS = 10000;

const DATE = new Date();
const INTEGER_ARRAY = [1, 2, 3];
const TEST_VALUES = [
  {
    key: 'arguments',
    value: (function() {
      return arguments;
    }('foo', 'bar'))
  },
  {
    key: 'array',
    value: ['foo', 'bar']
  },
  {
    key: 'arrayBuffer',
    value: new Uint16Array(INTEGER_ARRAY).buffer
  },
  {
    key: 'boolean',
    value: true
  },
  {
    key: 'dataView',
    value: new DataView(new ArrayBuffer(2))
  },
  {
    key: 'date',
    value: DATE
  },
  {
    key: 'error',
    value: new Error('test')
  },
  {
    key: 'float32Array',
    value: new Float32Array(INTEGER_ARRAY)
  },
  {
    key: 'float64Array',
    value: new Float64Array(INTEGER_ARRAY)
  },
  {
    key: 'function',
    value() {}
  },
  {
    key: 'generator',
    * value() {}
  },
  {
    key: 'int8Array',
    value: new Int8Array(INTEGER_ARRAY)
  },
  {
    key: 'int16Array',
    value: new Int16Array(INTEGER_ARRAY)
  },
  {
    key: 'int32Array',
    value: new Int32Array(INTEGER_ARRAY)
  },
  {
    key: 'map',
    value: new Map().set('foo', 'bar')
  },
  {
    key: 'null',
    value: null
  },
  {
    key: 'number',
    value: 12
  },
  {
    key: 'object',
    value: {foo: 'bar'}
  },
  {
    key: 'promise',
    value: Promise.resolve(1)
  },
  {
    key: 'regexp',
    value: /foo/
  },
  {
    key: 'set',
    value: new Set().add('foo')
  },
  {
    key: 'string',
    value: 'foo'
  },
  {
    key: 'symbol',
    value: Symbol('foo')
  },
  {
    key: 'uint8Array',
    value: new Uint8Array(INTEGER_ARRAY)
  },
  {
    key: 'uint8ClampedArray',
    value: new Uint8ClampedArray(INTEGER_ARRAY)
  },
  {
    key: 'uint16Array',
    value: new Uint16Array(INTEGER_ARRAY)
  },
  {
    key: 'uint32Array',
    value: new Uint32Array(INTEGER_ARRAY)
  },
  {
    key: 'undefined',
    value: undefined
  },
  {
    key: 'weakMap',
    value: new WeakMap().set({}, 'foo')
  },
  {
    key: 'weakSet',
    value: new WeakSet().add({})
  }
];

test('if hashed values are non-zero', (t) => {
  TEST_VALUES.forEach(({value}) => {
    t.not(hash(value), 0);
  });
});

let hashMap = {};

TEST_VALUES.forEach(({key, value}) => {
  hashMap[key] = hash(value);
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
      t.is(hash(value), hashMap[key]);
    });
  }
});

const COLLISION_TEST_SIZE = WORDS.length;

test(`if hash has no collisions with ${COLLISION_TEST_SIZE.toLocaleString()} integers`, (t) => {
  const size = COLLISION_TEST_SIZE;
  const collision = {};

  let count = 0,
      index = size,
      result;

  while (index--) {
    result = hash(index);

    if (collision[result]) {
      count++;
    }

    collision[result] = index;
  }

  t.is(count, 0);
});

test(`if hash has no collisions with ${COLLISION_TEST_SIZE.toLocaleString()} strings`, (t) => {
  const size = COLLISION_TEST_SIZE;
  const collision = {};

  let count = 0,
      index = size,
      result;

  while (index--) {
    result = hash(WORDS[index]);

    if (collision[result]) {
      count++;
    }

    collision[result] = index;
  }

  t.is(count, 0);
});

test(`if hash has no collisions with ${COLLISION_TEST_SIZE.toLocaleString()} random UUIDs`, (t) => {
  const size = COLLISION_TEST_SIZE;
  const collision = {};

  let count = 0,
      index = size,
      result;

  while (index--) {
    result = hash(uuid());

    if (collision[result]) {
      count++;
    }

    collision[result] = index;
  }

  t.is(count, 0);
});

test('if is creates a method to check equality', (t) => {
  const isUndefined = hash.is(undefined);
  const isNull = hash.is(null);

  t.true(isUndefined(void 0));
  t.false(isUndefined(null));

  t.true(isNull(null));
  t.false(isNull(void 0));
});

test('if is.all checks all objects for value equality based on hash across all objects', (t) => {
  const equalTest1 = {
    foo: 'bar'
  };
  const equalTest2 = {...equalTest1};
  const equalTest3 = {...equalTest2};

  const equalTest4 = {
    foo: 'baz'
  };

  t.not(equalTest1, equalTest2);
  t.true(hash.is.all(equalTest1, equalTest2));

  t.not(equalTest1, equalTest3);
  t.true(hash.is.all(equalTest1, equalTest3));
  t.true(hash.is.all(equalTest2, equalTest3));

  t.not(equalTest1, equalTest4);
  t.false(hash.is.all(equalTest1, equalTest4));

  t.true(hash.is.all(equalTest1, equalTest2, equalTest3));
  t.false(hash.is.all(equalTest1, equalTest2, equalTest4));
  t.false(hash.is.all(equalTest2, equalTest3, equalTest4));
});

test('if is.any checks any objects for value equality against the first based on hash across all objects', (t) => {
  const equalTest1 = {
    foo: 'bar'
  };
  const equalTest2 = {...equalTest1};
  const equalTest3 = {...equalTest2};

  const equalTest4 = {
    foo: 'baz'
  };

  t.not(equalTest1, equalTest2);
  t.true(hash.is.any(equalTest1, equalTest2));

  t.not(equalTest1, equalTest3);
  t.true(hash.is.any(equalTest1, equalTest3));
  t.true(hash.is.any(equalTest2, equalTest3));

  t.not(equalTest1, equalTest4);
  t.false(hash.is.any(equalTest1, equalTest4));

  t.true(hash.is.any(equalTest1, equalTest2, equalTest3));
  t.true(hash.is.any(equalTest1, equalTest2, equalTest4));
  t.true(hash.is.any(equalTest2, equalTest3, equalTest4));
  t.false(hash.is.any(equalTest4, equalTest1, equalTest2));
});

test('if is.not creates a method to check non-equality', (t) => {
  const isNotUndefined = hash.is.not(undefined);
  const isNotNull = hash.is.not(null);

  t.false(isNotUndefined(void 0));
  t.true(isNotUndefined(null));

  t.false(isNotNull(null));
  t.true(isNotNull(void 0));
});
