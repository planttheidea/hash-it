// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as utils from 'src/utils';
import {CIRCULAR_VALUE} from 'src/constants';

const DATE = new Date();
const ERROR = new Error('boom');
const INTEGER_ARRAY = [1, 2, 3];
const ARRAYBUFFER = new Uint16Array(INTEGER_ARRAY).buffer;
const TEST_VALUES = [
  {
    comparator: 'deepEqual',
    expectedResult: {},
    expectedString: '{}',
    key: '',
    value: {}
  },
  {
    comparator: 'deepEqual',
    expectedResult: ['foo', 'bar'],
    expectedString: '["foo","bar"]',
    key: 'array',
    value: ['foo', 'bar']
  },
  {
    comparator: 'deepEqual',
    expectedResult: (function() {
      return arguments;
    }('foo', 'bar')),
    expectedString: '{"0":"foo","1":"bar"}',
    key: 'arguments',
    value: (function() {
      return arguments;
    }('foo', 'bar'))
  },
  {
    comparator: 'deepEqual',
    expectedResult: `ArrayBuffer|${Buffer.from(ARRAYBUFFER).toString('utf8')}`,
    expectedString: JSON.stringify(`ArrayBuffer|${Buffer.from(ARRAYBUFFER).toString('utf8')}`),
    key: 'arrayBuffer',
    value: ARRAYBUFFER
  },
  {
    comparator: 'is',
    expectedResult: 'boolean|true',
    expectedString: 'boolean|true',
    key: 'boolean',
    value: true
  },
  {
    comparator: 'deepEqual',
    expectedResult: `DataView|${Buffer.from(new DataView(new ArrayBuffer(2)).buffer).toString('utf8')}`,
    expectedString: JSON.stringify(`DataView|${Buffer.from(new DataView(new ArrayBuffer(2)).buffer).toString('utf8')}`),
    key: 'dataView',
    value: new DataView(new ArrayBuffer(2))
  },
  {
    comparator: 'is',
    expectedResult: `Date|${DATE.valueOf()}`,
    expectedString: `Date|${DATE.valueOf()}`,
    key: 'date',
    value: DATE
  },
  {
    comparator: 'is',
    expectedResult: `Error|${ERROR.stack}`,
    expectedString: JSON.stringify(`Error|${ERROR.stack}`),
    key: 'error',
    value: ERROR
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Float32Array|1,2,3',
    expectedString: JSON.stringify('Float32Array|1,2,3'),
    key: 'float32Array',
    value: new Float32Array(INTEGER_ARRAY)
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Float64Array|1,2,3',
    expectedString: JSON.stringify('Float64Array|1,2,3'),
    key: 'float64Array',
    value: new Float64Array(INTEGER_ARRAY)
  },
  {
    comparator: 'is',
    expectedResult: 'function|function value() {}',
    expectedString: 'function|function value() {}',
    key: 'function',
    value() {}
  },
  {
    comparator: 'is',
    expectedResult: 'Generator|NOT_ENUMERABLE',
    expectedString: JSON.stringify('Generator|NOT_ENUMERABLE'),
    key: 'generator',
    value: (() => {
      function* gen() {
        yield 1;
        yield 2;
        yield 3;
      }

      return gen();
    })()
  },
  {
    comparator: 'is',
    expectedResult: `function|function value() {
    return _regenerator2.default.wrap(function value$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
          case 'end':
            return _context2.stop();
        }
      }
    }, value, this);
  }`,
    expectedString: `function|function value() {
    return _regenerator2.default.wrap(function value$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
          case 'end':
            return _context2.stop();
        }
      }
    }, value, this);
  }`,
    key: 'generatorFunction',
    * value() {}
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'HTMLDivElement|DIV foo class="class"',
    expectedString: JSON.stringify('HTMLDivElement|DIV foo class="class"'),
    key: 'htmlElement',
    value: (() => {
      const div = document.createElement('div');

      div.textContent = 'foo';
      div.className = 'class';

      return div;
    })()
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Int8Array|1,2,3',
    expectedString: JSON.stringify('Int8Array|1,2,3'),
    key: 'int8Array',
    value: new Int8Array(INTEGER_ARRAY)
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Int16Array|1,2,3',
    expectedString: JSON.stringify('Int16Array|1,2,3'),
    key: 'int16Array',
    value: new Int16Array(INTEGER_ARRAY)
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Int32Array|1,2,3',
    expectedString: JSON.stringify('Int32Array|1,2,3'),
    key: 'int32Array',
    value: new Int32Array(INTEGER_ARRAY)
  },
  {
    comparator: 'deepEqual',
    expectedResult: [{key: 'foo', value: 'bar'}],
    expectedString: '[{"key":"foo","value":"bar"}]',
    key: 'map',
    value: new Map().set('foo', 'bar')
  },
  {
    comparator: 'is',
    expectedResult: 'null|null',
    expectedString: 'null|null',
    key: 'null',
    value: null
  },
  {
    comparator: 'is',
    expectedResult: 'number|12',
    expectedString: 'number|12',
    key: 'number',
    value: 12
  },
  {
    comparator: 'deepEqual',
    expectedResult: {foo: 'bar'},
    expectedString: '{"foo":"bar"}',
    key: 'object',
    value: {foo: 'bar'}
  },
  {
    comparator: 'is',
    expectedResult: 'Promise|NOT_ENUMERABLE',
    expectedString: JSON.stringify('Promise|NOT_ENUMERABLE'),
    key: 'promise',
    value: Promise.resolve(1)
  },
  {
    comparator: 'is',
    expectedResult: 'RegExp|/foo/',
    expectedString: 'RegExp|/foo/',
    key: 'regexp',
    value: /foo/
  },
  {
    comparator: 'deepEqual',
    expectedResult: [{key: 'foo'}],
    expectedString: '[{"key":"foo"}]',
    key: 'set',
    value: new Set().add('foo')
  },
  {
    comparator: 'is',
    expectedResult: 'foo',
    expectedString: 'foo',
    key: 'string',
    value: 'foo'
  },
  {
    comparator: 'is',
    expectedResult: 'Symbol|Symbol(foo)',
    expectedString: 'Symbol|Symbol(foo)',
    key: 'symbol',
    value: Symbol('foo')
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Uint8Array|1,2,3',
    expectedString: JSON.stringify('Uint8Array|1,2,3'),
    key: 'uint8Array',
    value: new Uint8Array(INTEGER_ARRAY)
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Uint8ClampedArray|1,2,3',
    expectedString: JSON.stringify('Uint8ClampedArray|1,2,3'),
    key: 'uint8ClampedArray',
    value: new Uint8ClampedArray(INTEGER_ARRAY)
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Uint16Array|1,2,3',
    expectedString: JSON.stringify('Uint16Array|1,2,3'),
    key: 'uint16Array',
    value: new Uint16Array(INTEGER_ARRAY)
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Uint32Array|1,2,3',
    expectedString: JSON.stringify('Uint32Array|1,2,3'),
    key: 'uint32Array',
    value: new Uint32Array(INTEGER_ARRAY)
  },
  {
    comparator: 'is',
    expectedResult: 'undefined|undefined',
    expectedString: 'undefined|undefined',
    key: 'undefined',
    value: undefined
  },
  {
    comparator: 'is',
    expectedResult: 'WeakMap|NOT_ENUMERABLE',
    expectedString: JSON.stringify('WeakMap|NOT_ENUMERABLE'),
    key: 'weakMap',
    value: new WeakMap().set({}, 'foo')
  },
  {
    comparator: 'is',
    expectedResult: 'WeakSet|NOT_ENUMERABLE',
    expectedString: JSON.stringify('WeakSet|NOT_ENUMERABLE'),
    key: 'weakSet',
    value: new WeakSet().add({})
  }
];

test('if getCircularValue returns the stringified refCount', (t) => {
  const key = 'key';
  const value = 'value';
  const refCount = 123;

  const result = utils.getCircularValue(key, value, refCount);

  t.is(result, CIRCULAR_VALUE);
});

test('if getIntegerHashValue returns correct values', (t) => {
  const undef = undefined;
  const nil = null;
  const string = 'foo';

  t.is(utils.getIntegerHashValue(undef), 0);
  t.is(utils.getIntegerHashValue(nil), 0);
  t.is(utils.getIntegerHashValue(string), 193491849);
});

test('if sortIterablePair will return 1 when the first pair keystring is greater than the second', (t) => {
  const pairA = {keyString: 'foo'};
  const pairB = {keyString: 'bar'};

  const result = utils.sortIterablePair(pairA, pairB);

  t.is(result, 1);
});

test('if sortIterablePair will return -1 when the first pair keystring is less than the second', (t) => {
  const pairA = {keyString: 'bar'};
  const pairB = {keyString: 'baz'};

  const result = utils.sortIterablePair(pairA, pairB);

  t.is(result, -1);
});

test('if sortIterablePair will return 0 when the first pair keystring is the same as the second', (t) => {
  const pairA = {keyString: 'quz'};
  const pairB = {keyString: 'quz'};

  const result = utils.sortIterablePair(pairA, pairB);

  t.is(result, 0);
});

test('if getSortedIterablePairs will return the map pairs', (t) => {
  const iterable = new Map().set('foo', 'bar');

  const result = utils.getSortedIterablePairs(iterable);

  t.deepEqual(result, [{key: 'foo', value: 'bar'}]);
});

test('if getSortedIterablePairs will return the set pairs', (t) => {
  const iterable = new Set().add('foo');

  const result = utils.getSortedIterablePairs(iterable);

  t.deepEqual(result, [{key: 'foo'}]);
});

test('if getSortedIterablePairs will return the map pairs sorted by their keystring values', (t) => {
  const iterable = new Map().set('foo', 'bar').set('bar', 'baz');

  const result = utils.getSortedIterablePairs(iterable);

  t.deepEqual(result, [{key: 'bar', value: 'baz'}, {key: 'foo', value: 'bar'}]);
});

test('if getSortedIterablePairs will return the set pairs sorted by their keystring values', (t) => {
  const iterable = new Set().add('foo').add('bar');

  const result = utils.getSortedIterablePairs(iterable);

  t.deepEqual(result, [{key: 'bar'}, {key: 'foo'}]);
});

test('if getPrefixedValue will get the value prefixed with the tag', (t) => {
  const tag = 'tag';
  const value = 'value';

  const result = utils.getPrefixedValue(tag, value);

  t.is(result, `${tag}|${value}`);
});

test('if getSortedObject will get the object sorted by its keys', (t) => {
  const object = {foo: 'bar', bar: 'baz', baz: 'quz'};

  t.deepEqual(Object.keys(object), ['foo', 'bar', 'baz']);

  const result = utils.getSortedObject(object);

  t.deepEqual(result, object);
  t.notDeepEqual(Object.keys(object), Object.keys(result));

  t.deepEqual(Object.keys(result), ['bar', 'baz', 'foo']);
});

test.serial('if getStringifiedArrayBufferModern calls Buffer.from when there is support', (t) => {
  const stringified = 'stringified';
  const toString = sinon.stub().returns(stringified);

  const stub = sinon.stub(Buffer, 'from').returns({toString});

  const result = utils.getStringifiedArrayBufferModern(ARRAYBUFFER);

  t.true(Buffer.from.calledOnce);
  t.true(Buffer.from.calledWith(ARRAYBUFFER));

  t.true(toString.calledOnce);
  t.true(toString.calledWith('utf8'));

  stub.restore();

  t.is(result, stringified);
});

test.serial('if getStringifiedArrayBufferFallback creates a new Uint16Array when there is support', (t) => {
  const stringified = 'stringified';

  const stub = sinon.stub(String, 'fromCharCode').returns(stringified);

  const result = utils.getStringifiedArrayBufferFallback(ARRAYBUFFER);

  t.true(String.fromCharCode.calledOnce);
  t.deepEqual(String.fromCharCode.args[0], INTEGER_ARRAY);

  stub.restore();

  t.is(result, stringified);
});

test('if getStringifiedArrayBufferNoSupport will return an empty string', (t) => {
  const result = utils.getStringifiedArrayBufferNoSupport(ARRAYBUFFER);

  t.is(result, '');
});

test('if getStringifiedElement will return the string for an empty element', (t) => {
  const element = document.createElement('div');

  const result = utils.getStringifiedElement(element);

  t.is(result, element.tagName);
});

test('if getStringifiedElement will return the string for an element with inner HTML', (t) => {
  const element = document.createElement('div');

  element.innerHTML = '<span>contents</span>';

  const result = utils.getStringifiedElement(element);

  t.is(result, `${element.tagName} ${element.innerHTML}`);
});

test('if getStringifiedElement will return the string for an element with attributes', (t) => {
  const element = document.createElement('div');

  element.className = 'class-name';

  const result = utils.getStringifiedElement(element);

  t.is(result, `${element.tagName} class="${element.className}"`);
});

test('if getStringifiedElement will return the string for an element with attributes and inner HTML', (t) => {
  const element = document.createElement('div');

  element.innerHTML = '<span>contents</span>';
  element.className = 'class-name';

  const result = utils.getStringifiedElement(element);

  t.is(result, `${element.tagName} ${element.innerHTML} class="${element.className}"`);
});

test('if getNormalizedValue will return the value passed if a string', (t) => {
  const value = 'string';
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, value);
});

test('if getNormalizedValue will return the prefixed value passed if a primitive', (t) => {
  const value = true;
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, utils.getPrefixedValue(typeof value, value));
});

test('if getNormalizedValue will return the prefixed value passed if null', (t) => {
  const value = null;
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, utils.getPrefixedValue('null', value));
});

test('if getNormalizedValue will return the value passed if considered a "self" object', (t) => {
  const value = ['foo'];
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, value);
});

test('if getNormalizedValue will return the sorted value passed if an object', (t) => {
  const value = {foo: 'bar', bar: 'baz'};
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.not(result, value);
  t.deepEqual(result, utils.getSortedObject(value));
});

test('if getNormalizedValue will return the circular value if an object that has already been processed', (t) => {
  const value = {foo: 'bar', bar: 'baz'};
  const sortedCache = new WeakSet();

  sortedCache.add(value);

  const result = utils.getNormalizedValue(value, sortedCache);

  t.not(result, value);
  t.deepEqual(result, CIRCULAR_VALUE);
});

test('if getNormalizedValue will return the toString value passed if toString must be called', (t) => {
  const value = Symbol('value');
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, utils.getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), value.toString()));
});

test('if getNormalizedValue will return the pairs value passed if an iterable', (t) => {
  const value = new Map().set('foo', 'bar').set('bar', 'baz');
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.deepEqual(result, utils.getSortedIterablePairs(value));
});

test('if getNormalizedValue will return the circular value if an iterable that has already been processed', (t) => {
  const value = new Map().set('foo', 'bar').set('bar', 'baz');
  const sortedCache = new WeakSet();

  sortedCache.add(value);

  const result = utils.getNormalizedValue(value, sortedCache);

  t.deepEqual(result, CIRCULAR_VALUE);
});

test('if getNormalizedValue will return the epoch value passed if a date', (t) => {
  const value = new Date();
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, utils.getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), value.getTime()));
});

test('if getNormalizedValue will return the stack value passed if an error', (t) => {
  const value = new Error('boom');
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, utils.getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), value.stack));
});

test('if getNormalizedValue will return the placeholder value if not enumerable', (t) => {
  const value = new Promise(() => {});
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, utils.getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), 'NOT_ENUMERABLE'));
});

test('if getNormalizedValue will return the HTML tag with attributes if an HTML element', (t) => {
  const value = document.createElement('main');

  value.className = 'className';
  value.id = 'id';

  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(
    result,
    utils.getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), utils.getStringifiedElement(value))
  );
});

test('if getNormalizedValue will return the joined value if a typed array', (t) => {
  const value = new Uint16Array([1, 2, 3]);
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, utils.getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), value.join(',')));
});

test('if getNormalizedValue will return the stringified buffer value if an array buffer', (t) => {
  const value = ARRAYBUFFER;
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(
    result,
    utils.getPrefixedValue(Object.prototype.toString.call(value).slice(8, -1), utils.getStringifiedArrayBuffer(value))
  );
});

test('if getNormalizedValue will return the stringified buffer value if a dataview', (t) => {
  const value = new DataView(ARRAYBUFFER);
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(
    result,
    utils.getPrefixedValue(
      Object.prototype.toString.call(value).slice(8, -1),
      utils.getStringifiedArrayBuffer(value.buffer)
    )
  );
});

test('if getNormalizedValue will return the value itself if not matching', (t) => {
  class Foo {
    constructor(value) {
      this.value = value;

      return this;
    }

    get [Symbol.toStringTag]() {
      return 'Foo';
    }
  }

  const value = new Foo('bar');
  const sortedCache = new WeakSet();

  const result = utils.getNormalizedValue(value, sortedCache);

  t.is(result, value);
});

test('if createReplacer provides correct values for different object types', (t) => {
  const sortedCache = new WeakSet();

  TEST_VALUES.forEach(({comparator, expectedResult, key, value}) => {
    t[comparator](utils.createReplacer(sortedCache)(key, value), expectedResult, key);
  });
});

test('if stringify uses JSON.stringify with createReplacer correctly', (t) => {
  TEST_VALUES.forEach(({comparator, expectedString, value}) => {
    t[comparator](utils.stringify(value), expectedString);
  });
});

test('if stringify handles deeply-recursive objects', (t) => {
  try {
    utils.stringify(window);

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});
