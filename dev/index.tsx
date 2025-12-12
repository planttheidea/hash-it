import { Component } from 'react';
import { hash } from '../src/index.js';
// import { hash } from '../dist/es/index.mjs';

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = '0px';
document.body.style.padding = '0px';

const fragment = document.createDocumentFragment();

fragment.appendChild(document.createElement('div'));
fragment.appendChild(document.createElement('ul'));
fragment.appendChild(document.createElement('span'));

class StatefulComponent extends Component {
  override render() {
    return <div>test</div>;
  }
}

const StatelessComponent = () => <div>test</div>;

const a: Record<string, any> = {
  foo: 'bar',
};

const b = {
  a,
};

a.b = b;

function getArguments() {
  // eslint-disable-next-line prefer-rest-params
  return arguments;
}

const object = {
  ReactStatefulClass: StatefulComponent,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ReactStatefulElement: <StatefulComponent />,
  ReactStatelessClass: StatelessComponent,
  ReactStatelessElement: <StatelessComponent />,
  // @ts-expect-error - arguments are not defined
  arguments: getArguments('foo', 'bar'),
  arr: ['foo', 'bar'],
  arrayBuffer: new Uint16Array([1, 2, 3]).buffer,
  bigint: BigInt(9007199254740991),
  bool: true,
  blob: new Blob(['foo']),
  dataView: new DataView(new ArrayBuffer(2)),
  doc: document,
  el: document.createElement('div'),
  err: new Error('Stuff'),
  event: (() => {
    try {
      return new Event('custom');
    } catch {
      const event = document.createEvent('Event');

      // eslint-disable-next-line @typescript-eslint/no-deprecated
      event.initEvent('custom', true, true);

      return event;
    }
  })(),
  float32Array: new Float32Array([1, 2, 3]),
  float64Array: new Float64Array([1, 2, 3]),
  fragment,
  func() {
    alert('y');
  },
  *generator(): Generator<any> {
    const value = yield 1;

    yield value + 2;
  },
  int8Array: new Int8Array([1, 2, 3]),
  int16Array: new Int16Array([1, 2, 3]),
  int32Array: new Int32Array([1, 2, 3]),
  map: new Map().set(true, 7).set({ foo: 3 }, ['abc']),
  math: Math,
  nil: null,
  nodeList: document.querySelectorAll('div'),
  num: 12,
  obj: {
    foo: 'bar',
  },
  promise: Promise.resolve(123),
  regexp: /test/,
  set: new Set().add('foo').add(2),
  string: 'foo',
  svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
  symbol: Symbol('test'),
  uint8Array: new Uint8Array([1, 2, 3]),
  uint8ClampedArray: new Uint8ClampedArray([1, 2, 3]),
  uint16Array: new Uint16Array([1, 2, 3]),
  uint32Array: new Uint32Array([1, 2, 3]),
  undef: undefined,
  weakMap: new WeakMap().set({}, 7).set({ foo: 3 }, ['abc']),
  weakSet: new WeakSet().add({}).add({ foo: 'bar' }),
  win: window,
};

// const profile = (iterations = 100) => {
//   let index = -1;

//   console.profile('hash timing');

//   while (++index < iterations) {
//     hash(object);
//     hash(a);

//     for (const key in object) {
//       // @ts-expect-error - not worth it
//       hash(object[key]);
//     }

//     hash(document.body);
//     // this is the killer, so only profiled if you uncomment
//     // hash(window);
//   }

//   console.profileEnd('hash timing');

//   console.log('Check the Profiles tab in DevTools to see the output.');
// };

// const benchmark = () => require('../benchmarks/index');

const visualValidation = () => {
  console.log(object, hash(object));
  console.log(a, hash(a));

  Object.entries(object).forEach(([key, value]) => {
    console.log(key, value, hash(value));
  });
};

// const hashOnlyValidation = () => {
//   console.log(hash(object));
//   console.log(hash(a));

//   Object.entries(object).forEach(([key, value]) => {
//     console.log(key, hash(value));
//   });
// };

// const testResult = (name: string, value: any) => {
//   console.log(name, value, [hash(value), hash(value), hash(value)]);
// };

// benchmark();
// profile(1000);
visualValidation();
// hashOnlyValidation();

const div = document.createElement('div');

div.textContent = 'Check the console for details.';

document.body.appendChild(div);
