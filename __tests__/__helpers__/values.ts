/* eslint-disable @typescript-eslint/no-unused-vars */

export const INTEGER_ARRAY = [1, 2, 3];
// @ts-expect-error - BigInt values not supported with lower targets.
export const BIG_INTEGER_ARRAY = [21n, 31n];

export const ARRAY_BUFFER = new Uint16Array(INTEGER_ARRAY).buffer;
export const DATE = new Date();
export const ERROR = new Error('boom');

const DOCUMENT_FRAGMENT = document.createDocumentFragment();
DOCUMENT_FRAGMENT.appendChild(document.createElement('div'));

const EVENT = new Event('custom');

export const TEST_VALUES = [
  {
    comparator: 'deepEqual',
    key: '',
    value: {},
  },
  {
    comparator: 'deepEqual',
    key: 'array',
    value: ['foo', 'bar'],
  },
  {
    comparator: 'deepEqual',
    key: 'arguments',
    value: (function (_a: string, _b: string) {
      return arguments;
    })('foo', 'bar'),
  },
  {
    comparator: 'deepEqual',
    key: 'arrayBuffer',
    value: ARRAY_BUFFER,
  },
  {
    comparator: 'is',
    key: 'bigInt',
    value: BigInt(9007199254740991),
  },
  {
    comparator: 'is',
    key: 'bigInt64Array',
    value: new BigInt64Array(BIG_INTEGER_ARRAY),
  },
  {
    comparator: 'is',
    key: 'bigUint64Array',
    value: new BigUint64Array(BIG_INTEGER_ARRAY),
  },
  {
    comparator: 'is',
    key: 'boolean',
    value: true,
  },
  {
    comparator: 'deepEqual',
    key: 'dataView',
    value: new DataView(new ArrayBuffer(2)),
  },
  {
    comparator: 'is',
    key: 'date',
    value: DATE,
  },
  {
    comparator: 'is',
    key: 'error',
    value: ERROR,
  },
  {
    comparator: 'deepEqual',
    key: 'event',
    value: EVENT,
  },
  {
    comparator: 'is',
    key: 'float32Array',
    value: new Float32Array(INTEGER_ARRAY),
  },
  {
    comparator: 'is',
    key: 'float64Array',
    value: new Float64Array(INTEGER_ARRAY),
  },
  {
    comparator: 'is',
    key: 'function',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    value() {},
  },
  {
    comparator: 'is',
    key: 'generator',
    value: (() => {
      function* gen() {
        yield 1;
        yield 2;
        yield 3;
      }

      return gen();
    })(),
  },
  {
    comparator: 'is',
    key: 'generatorFunction',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    *value() {},
  },
  {
    comparator: 'deepEqual',
    key: 'htmlElement',
    value: (() => {
      const div = document.createElement('div');

      div.textContent = 'foo';
      div.className = 'class';

      return div;
    })(),
  },
  {
    comparator: 'deepEqual',
    key: 'svgElement',
    value: (() =>
      document.createElementNS('http://www.w3.org/2000/svg', 'svg'))(),
  },
  {
    comparator: 'deepEqual',
    key: 'documentFragment',
    value: DOCUMENT_FRAGMENT,
  },
  {
    comparator: 'deepEqual',
    key: 'int8Array',
    value: new Int8Array(INTEGER_ARRAY),
  },
  {
    comparator: 'deepEqual',
    key: 'int16Array',
    value: new Int16Array(INTEGER_ARRAY),
  },
  {
    comparator: 'deepEqual',
    key: 'int32Array',
    value: new Int32Array(INTEGER_ARRAY),
  },
  {
    comparator: 'deepEqual',
    key: 'map',
    value: new Map().set('foo', 'bar'),
  },
  {
    comparator: 'is',
    expectedResult: 'null|null',
    expectedString: 'null|null',
    key: 'null',
    value: null,
  },
  {
    comparator: 'is',
    key: 'number',
    value: 12,
  },
  {
    comparator: 'deepEqual',
    key: 'object',
    value: { foo: 'bar' },
  },
  {
    comparator: 'is',
    key: 'promise',
    value: Promise.resolve(1),
  },
  {
    comparator: 'is',
    key: 'regexp',
    value: /foo/,
  },
  {
    comparator: 'deepEqual',
    key: 'set',
    value: new Set().add('foo'),
  },
  {
    comparator: 'is',
    key: 'string',
    value: 'foo',
  },
  {
    comparator: 'is',
    key: 'symbol',
    value: Symbol('foo'),
  },
  {
    comparator: 'deepEqual',
    key: 'uint8Array',
    value: new Uint8Array(INTEGER_ARRAY),
  },
  {
    comparator: 'deepEqual',
    key: 'uint8ClampedArray',
    value: new Uint8ClampedArray(INTEGER_ARRAY),
  },
  {
    comparator: 'deepEqual',
    key: 'uint16Array',
    value: new Uint16Array(INTEGER_ARRAY),
  },
  {
    comparator: 'deepEqual',
    key: 'uint32Array',
    value: new Uint32Array(INTEGER_ARRAY),
  },
  {
    comparator: 'is',
    key: 'undefined',
    value: undefined,
  },
  {
    comparator: 'is',
    key: 'weakMap',
    value: new WeakMap().set({}, 'foo'),
  },
  {
    comparator: 'is',
    key: 'weakSet',
    value: new WeakSet().add({}),
  },
  {
    comparator: 'is',
    key: 'weakRef',
    value: new WeakRef({}),
  },
];
