import React from 'react';
import { render } from 'react-dom';
import hash from '../src';


document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = 0;
document.body.style.padding = 0;

const fragment = document.createDocumentFragment();

fragment.appendChild(document.createElement('div'));
fragment.appendChild(document.createElement('ul'));
fragment.appendChild(document.createElement('span'));

class StatefulComponent extends React.Component {
  render() {
    return <div>test</div>;
  }
}

const StatelessComponent = () => <div>test</div>;

const a = {
  foo: 'bar',
};

const b = {
  a,
};

a.b = b;

const object = {
  ReactStatefulClass: StatefulComponent,
  ReactStatefulElement: <StatefulComponent />,
  ReactStatelessClass: StatelessComponent,
  ReactStatelessElement: <StatelessComponent />,
  arr: ['foo', 'bar'],
  arrayBuffer: new Uint16Array([1, 2, 3]).buffer,
  bool: true,
  dataView: new DataView(new ArrayBuffer(2)),
  doc: document,
  el: document.createElement('div'),
  err: new Error('Stuff'),
  event: (() => {
    try {
      return new Event('custom');
    } catch (error) {
      const event = document.createEvent('Event');

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
  * generator() {
    let value = yield 1;

    yield value + 2;
  },
  int8Array: new Int8Array([1, 2, 3]),
  int16Array: new Int16Array([1, 2, 3]),
  int32Array: new Int32Array([1, 2, 3]),
  map: new Map().set(true, 7).set({foo: 3}, ['abc']),
  nil: null,
  nodeList: document.querySelectorAll('div'),
  num: 12,
  obj: {
    foo: 'bar',
  },
  promise: Promise.resolve(1),
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
  weakMap: new WeakMap().set({}, 7).set({foo: 3}, ['abc']),
  weakSet: new WeakSet().add({}).add({foo: 'bar'}),
  win: window,
};

const profile = (iterations = 100) => {
  let index = -1;

  console.profile('hash timing');

  while (++index < iterations) {
    hash(object);
    hash(a);

    for (let key in object) {
      hash(object[key]);
    }

    hash(document.body);
    // this is the killer, so only profiled if you uncomment
    // hash(window);
  }

  console.profileEnd('hash timing');

  console.log('Check the Profiles tab in DevTools to see the output.');
};

const benchmark = () => require('../benchmarks/index');

const visualValidation = (iterations = 100) => {
  console.log(object, hash(object));
  console.log(a, hash(a));
  console.log(object.string, hash(object.string));
  console.log(object.num, hash(object.num));
  console.log(object.bool, hash(object.bool));
  console.log(object.func, hash(object.func));
  console.log(object.undef, hash(object.undef));
  console.log(object.nil, hash(object.nil));
  console.log(object.obj, hash(object.obj));
  console.log(object.arr, hash(object.arr));
  console.log(object.el, hash(object.el));
  console.log(object.fragment, hash(object.fragment));
  console.log(object.svg, hash(object.svg));
  console.log(object.regexp, hash(object.regexp));
  console.log(object.event, hash(object.event));
  console.log(object.nodeList, hash(object.nodeList));

  // comment out for older browser testing
  console.log(object.symbol, hash(object.symbol));
  console.log(object.err, hash(object.err));
  console.log(object.map, hash(object.map));
  console.log(object.set, hash(object.set));
  console.log(object.weakMap, hash(object.weakMap));
  console.log(object.weakSet, hash(object.weakSet));
  console.log(object.dataView, hash(object.dataView));
  console.log(object.arrayBuffer, hash(object.arrayBuffer));
  console.log(object.float32Array, hash(object.float32Array));
  console.log(object.float64Array, hash(object.float64Array));
  console.log(object.generator, hash(object.generator));
  console.log(object.int8Array, hash(object.int8Array));
  console.log(object.int16Array, hash(object.int16Array));
  console.log(object.int32Array, hash(object.int32Array));
  console.log(object.promise, hash(object.promise));
  console.log(object.uint8Array, hash(object.uint8Array));
  console.log(object.uint8ClampedArray, hash(object.uint8ClampedArray));
  console.log(object.uint16Array, hash(object.uint16Array));
  console.log(object.uint32Array, hash(object.uint32Array));

  console.log(object.ReactStatefulClass, hash(object.ReactStatefulClass));
  console.log(object.ReactStatefulElement, hash(object.ReactStatefulElement));
  console.log(object.ReactStatelessClass, hash(object.ReactStatelessClass));
  console.log(object.ReactStatelessElement, hash(object.ReactStatelessElement));
  console.log(object.doc.body, hash(object.doc.body));
  console.log(object.win, hash(object.win));
};

const hashOnlyValidation = (iterations = 100) => {
  console.log(hash(object));
  console.log(hash(a));
  console.log(hash(object.string));
  console.log(hash(object.num));
  console.log(hash(object.bool));
  console.log(hash(object.func));
  console.log(hash(object.undef));
  console.log(hash(object.nil));
  console.log(hash(object.obj));
  console.log(hash(object.arr));
  console.log(hash(object.el));
  console.log(hash(object.fragment));
  console.log(hash(object.svg));
  console.log(hash(object.math));
  console.log(hash(object.regexp));
  console.log(hash(object.event));
  console.log(hash(object.nodeList));

  // comment out for older browser testing
  console.log(hash(object.symbol));
  console.log(hash(object.err));
  console.log(hash(object.map));
  console.log(hash(object.set));
  console.log(hash(object.weakMap));
  console.log(hash(object.weakSet));
  console.log(hash(object.arrayBuffer));
  console.log(hash(object.dataView));
  console.log(hash(object.float32Array));
  console.log(hash(object.float64Array));
  console.log(hash(object.generator));
  console.log(hash(object.int8Array));
  console.log(hash(object.int16Array));
  console.log(hash(object.int32Array));
  console.log(hash(object.promise));
  console.log(hash(object.uint8Array));
  console.log(hash(object.uint8ClampedArray));
  console.log(hash(object.uint16Array));
  console.log(hash(object.uint32Array));

  console.log(hash(object.ReactStatefulClass));
  console.log(hash(object.ReactStatefulElement));
  console.log(hash(object.ReactStatelessClass));
  console.log(hash(object.ReactStatelessElement));
  console.log(hash(document.body));
  console.log(hash(window));
};

// benchmark();
// profile(1000);
visualValidation();
// hashOnlyValidation();

const div = document.createElement('div');

render(<div>Check the console for more details!</div>, div);

document.body.appendChild(div);
