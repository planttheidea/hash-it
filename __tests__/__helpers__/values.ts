/* eslint-disable @typescript-eslint/no-unused-vars */

export const INTEGER_ARRAY = [1, 2, 3];

export const ARRAY_BUFFER = new Uint16Array(INTEGER_ARRAY).buffer;
export const DATE = new Date();
export const ERROR = new Error('boom');

const DOCUMENT_FRAGMENT = document.createDocumentFragment();
DOCUMENT_FRAGMENT.appendChild(document.createElement('div'));

const EVENT = new Event('custom');

export const TEST_VALUES = [
  {
    comparator: 'deepEqual',
    expectedResult: {},
    expectedString: '{}',
    key: '',
    value: {},
  },
  {
    comparator: 'deepEqual',
    expectedResult: ['foo', 'bar'],
    expectedString: '["string|foo","string|bar"]',
    key: 'array',
    value: ['foo', 'bar'],
  },
  {
    comparator: 'deepEqual',
    expectedResult: (function (a: string, b: string) {
      return arguments;
    })('foo', 'bar'),
    expectedString: '{"0":"string|foo","1":"string|bar"}',
    key: 'arguments',
    value: (function (a: string, b: string) {
      return arguments;
    })('foo', 'bar'),
  },
  {
    comparator: 'deepEqual',
    expectedResult: `ArrayBuffer|${Buffer.from(ARRAY_BUFFER).toString('utf8')}`,
    expectedString: JSON.stringify(
      `ArrayBuffer|${Buffer.from(ARRAY_BUFFER).toString('utf8')}`,
    ),
    key: 'arrayBuffer',
    value: ARRAY_BUFFER,
  },
  {
    comparator: 'is',
    expectedResult: 'bigint|9007199254740991',
    expectedString: 'bigint|9007199254740991',
    key: 'bigint',
    value: BigInt(9007199254740991),
  },
  {
    comparator: 'is',
    expectedResult: 'boolean|true',
    expectedString: 'boolean|true',
    key: 'boolean',
    value: true,
  },
  {
    comparator: 'deepEqual',
    expectedResult: `DataView|${Buffer.from(
      new DataView(new ArrayBuffer(2)).buffer,
    ).toString('utf8')}`,
    expectedString: JSON.stringify(
      `DataView|${Buffer.from(new DataView(new ArrayBuffer(2)).buffer).toString(
        'utf8',
      )}`,
    ),
    key: 'dataView',
    value: new DataView(new ArrayBuffer(2)),
  },
  {
    comparator: 'is',
    expectedResult: `Date|${DATE.valueOf()}`,
    expectedString: `Date|${DATE.valueOf()}`,
    key: 'date',
    value: DATE,
  },
  {
    comparator: 'is',
    expectedResult: `Error|${ERROR.stack}`,
    expectedString: JSON.stringify(`Error|${ERROR.stack}`),
    key: 'error',
    value: ERROR,
  },
  {
    comparator: 'deepEqual',
    expectedResult: {
      bubbles: EVENT.bubbles,
      cancelBubble: EVENT.cancelBubble,
      cancelable: EVENT.cancelable,
      composed: EVENT.composed,
      currentTarget: EVENT.currentTarget,
      defaultPrevented: EVENT.defaultPrevented,
      eventPhase: EVENT.eventPhase,
      isTrusted: EVENT.isTrusted,
      returnValue: EVENT.returnValue,
      target: EVENT.target,
      type: EVENT.type,
    },
    expectedString: JSON.stringify({
      bubbles: `boolean|${EVENT.bubbles}`,
      cancelBubble: `boolean|${EVENT.cancelBubble}`,
      cancelable: `boolean|${EVENT.cancelable}`,
      composed: `boolean|${EVENT.composed}`,
      currentTarget: `null|${EVENT.currentTarget}`,
      defaultPrevented: `boolean|${EVENT.defaultPrevented}`,
      eventPhase: `number|${EVENT.eventPhase}`,
      isTrusted: `boolean|${EVENT.isTrusted}`,
      returnValue: `boolean|${EVENT.returnValue}`,
      target: `null|${EVENT.target}`,
      type: 'string|' + EVENT.type,
    }),
    key: 'event',
    value: EVENT,
  },
  {
    comparator: 'is',
    expectedResult: 'Float32Array|1,2,3',
    expectedString: JSON.stringify('Float32Array|1,2,3'),
    key: 'float32Array',
    value: new Float32Array(INTEGER_ARRAY),
  },
  {
    comparator: 'is',
    expectedResult: 'Float64Array|1,2,3',
    expectedString: JSON.stringify('Float64Array|1,2,3'),
    key: 'float64Array',
    value: new Float64Array(INTEGER_ARRAY),
  },
  {
    comparator: 'is',
    expectedResult: 'function|function value() {}',
    expectedString: 'function|function value() {}',
    key: 'function',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    value() {},
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
    })(),
  },
  {
    comparator: 'is',
    expectedResult: `function|function value() {
    return _regenerator.default.wrap(function value$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
          case "end":
            return _context2.stop();
        }
      }
    }, value);
  }`,
    expectedString: `function|function value() {
    return _regenerator.default.wrap(function value$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
          case "end":
            return _context2.stop();
        }
      }
    }, value);
  }`,
    key: 'generatorFunction',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    *value() {},
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'HTMLDivElement|<div class="class">foo</div>',
    expectedString: JSON.stringify(
      'HTMLDivElement|<div class="class">foo</div>',
    ),
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
    expectedResult: 'SVGSVGElement|<svg></svg>',
    expectedString: JSON.stringify('SVGSVGElement|<svg></svg>'),
    key: 'svgElement',
    value: (() =>
      document.createElementNS('http://www.w3.org/2000/svg', 'svg'))(),
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'DocumentFragment|<div></div>',
    expectedString: JSON.stringify('DocumentFragment|<div></div>'),
    key: 'documentFragment',
    value: DOCUMENT_FRAGMENT,
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Int8Array|1,2,3',
    expectedString: JSON.stringify('Int8Array|1,2,3'),
    key: 'int8Array',
    value: new Int8Array(INTEGER_ARRAY),
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Int16Array|1,2,3',
    expectedString: JSON.stringify('Int16Array|1,2,3'),
    key: 'int16Array',
    value: new Int16Array(INTEGER_ARRAY),
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Int32Array|1,2,3',
    expectedString: JSON.stringify('Int32Array|1,2,3'),
    key: 'int32Array',
    value: new Int32Array(INTEGER_ARRAY),
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Map|[[string|foo,string|bar]]',
    expectedString: JSON.stringify('Map|[[string|foo,string|bar]]'),
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
    expectedResult: 'number|12',
    expectedString: 'number|12',
    key: 'number',
    value: 12,
  },
  {
    comparator: 'deepEqual',
    expectedResult: { foo: 'bar' },
    expectedString: '{"foo":"string|bar"}',
    key: 'object',
    value: { foo: 'bar' },
  },
  {
    comparator: 'is',
    expectedResult: 'Promise|NOT_ENUMERABLE',
    expectedString: JSON.stringify('Promise|NOT_ENUMERABLE'),
    key: 'promise',
    value: Promise.resolve(1),
  },
  {
    comparator: 'is',
    expectedResult: 'RegExp|/foo/',
    expectedString: 'RegExp|/foo/',
    key: 'regexp',
    value: /foo/,
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Set|[string|foo]',
    expectedString: JSON.stringify('Set|[string|foo]'),
    key: 'set',
    value: new Set().add('foo'),
  },
  {
    comparator: 'is',
    expectedResult: 'string|foo',
    expectedString: 'string|foo',
    key: 'string',
    value: 'foo',
  },
  {
    comparator: 'is',
    expectedResult: 'Symbol|Symbol(foo)',
    expectedString: 'Symbol|Symbol(foo)',
    key: 'symbol',
    value: Symbol('foo'),
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Uint8Array|1,2,3',
    expectedString: JSON.stringify('Uint8Array|1,2,3'),
    key: 'uint8Array',
    value: new Uint8Array(INTEGER_ARRAY),
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Uint8ClampedArray|1,2,3',
    expectedString: JSON.stringify('Uint8ClampedArray|1,2,3'),
    key: 'uint8ClampedArray',
    value: new Uint8ClampedArray(INTEGER_ARRAY),
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Uint16Array|1,2,3',
    expectedString: JSON.stringify('Uint16Array|1,2,3'),
    key: 'uint16Array',
    value: new Uint16Array(INTEGER_ARRAY),
  },
  {
    comparator: 'deepEqual',
    expectedResult: 'Uint32Array|1,2,3',
    expectedString: JSON.stringify('Uint32Array|1,2,3'),
    key: 'uint32Array',
    value: new Uint32Array(INTEGER_ARRAY),
  },
  {
    comparator: 'is',
    expectedResult: 'undefined|undefined',
    expectedString: 'undefined|undefined',
    key: 'undefined',
    value: undefined,
  },
  {
    comparator: 'is',
    expectedResult: 'WeakMap|NOT_ENUMERABLE',
    expectedString: JSON.stringify('WeakMap|NOT_ENUMERABLE'),
    key: 'weakMap',
    value: new WeakMap().set({}, 'foo'),
  },
  {
    comparator: 'is',
    expectedResult: 'WeakSet|NOT_ENUMERABLE',
    expectedString: JSON.stringify('WeakSet|NOT_ENUMERABLE'),
    key: 'weakSet',
    value: new WeakSet().add({}),
  },
];
