import hashIt from '../src/index';

import React from 'react';
import {
  render
} from 'react-dom';

class StatefulComponent extends React.Component {
  render() {
    return (
      <div>test</div>
    );
  }
}

const StatelessComponent = () => {
  return (
    <div>test</div>
  );
};

const a = {
  foo: 'bar'
};

const b = {
  a
};

a.b = b;

const object = {
  string: 'foo',
  num: 12,
  bool: true,
  func() {
    alert('y');
  },
  generator: function* () {
    let value = yield 1;

    yield value + 2;
  },
  undef: undefined,
  nil: null,
  obj: {
    foo: 'bar'
  },
  arr: [
    'foo',
    'bar'
  ],
  el: document.createElement('div'),
  math: Math,
  regexp: /test/,
  
  // comment out for older browser testing
  err: new Error('Stuff'),
  symbol: Symbol('test'),
  map: new Map().set(true, 7).set({foo: 3}, ['abc']),
  set: new Set().add('foo').add(2),
  weakMap: new WeakMap().set({}, 7).set({foo: 3}, ['abc']),
  arrayBuffer: new Uint16Array([1, 2, 3]).buffer,
  dataView: new DataView(new ArrayBuffer(2)),
  float32Array: new Float32Array([1, 2, 3]),
  float64Array: new Float64Array([1, 2, 3]),
  int8Array: new Int8Array([1, 2, 3]),
  int16Array: new Int16Array([1, 2, 3]),
  int32Array: new Int32Array([1, 2, 3]),
  promise: Promise.resolve(1),
  uint8Array: new Uint8Array([1, 2, 3]),
  uint8ClampedArray: new Uint8ClampedArray([1, 2, 3]),
  uint16Array: new Uint16Array([1, 2, 3]),
  uint32Array: new Uint32Array([1, 2, 3]),

  ReactStatefulClass: StatefulComponent,
  ReactStatefulElement: <StatefulComponent/>,
  ReactStatelessClass: StatelessComponent,
  ReactStatelessElement: <StatelessComponent/>
};

const profile = (iterations = 100) => {
  let index = -1;

  console.profile('hashIt timing');

  while (++index < iterations) {
    hashIt(object);
    hashIt(a);

    for (let key in object) {
      hashIt(object[key]);
    }

    hashIt(document.body);
    // this is the killer, so only profiled if you uncomment
    // hashIt(window);
  }

  console.profileEnd('hashIt timing');

  console.log('Check the Profiles tab in DevTools to see the output.');
};

const visualValidation = (iterations = 100) => {
  console.log(object, hashIt(object));
  console.log(a, hashIt(a));
  console.log(object.string, hashIt(object.string));
  console.log(object.num, hashIt(object.num));
  console.log(object.bool, hashIt(object.bool));
  console.log(object.func, hashIt(object.func));
  console.log(object.undef, hashIt(object.undef));
  console.log(object.nil, hashIt(object.nil));
  console.log(object.obj, hashIt(object.obj));
  console.log(object.arr, hashIt(object.arr));
  console.log(object.el, hashIt(object.el));
  console.log(object.math, hashIt(object.math));
  console.log(object.regexp, hashIt(object.regexp));
  console.log(object.symbol, hashIt(object.symbol));
  
  // comment out for older browser testing
  console.log(object.err, hashIt(object.err));
  console.log(object.map, hashIt(object.map));
  console.log(object.set, hashIt(object.set));
  console.log(object.weakMap, hashIt(object.weakMap));
  console.log(object.weakSet, hashIt(object.weakSet));
  console.log(object.dataView, hashIt(object.dataView));
  console.log(object.arrayBuffer, hashIt(object.arrayBuffer));
  console.log(object.float32Array, hashIt(object.float32Array));
  console.log(object.float64Array, hashIt(object.float64Array));
  console.log(object.generator, hashIt(object.generator));
  console.log(object.int8Array, hashIt(object.int8Array));
  console.log(object.int16Array, hashIt(object.int16Array));
  console.log(object.int32Array, hashIt(object.int32Array));
  console.log(object.promise, hashIt(object.promise));
  console.log(object.uint8Array, hashIt(object.uint8Array));
  console.log(object.uint8ClampedArray, hashIt(object.uint8ClampedArray));
  console.log(object.uint16Array, hashIt(object.uint16Array));
  console.log(object.uint32Array, hashIt(object.uint32Array));

  console.log(object.ReactStatefulClass, hashIt(object.ReactStatefulClass));
  console.log(object.ReactStatefulElement, hashIt(object.ReactStatefulElement));
  console.log(object.ReactStatelessClass, hashIt(object.ReactStatelessClass));
  console.log(object.ReactStatelessElement, hashIt(object.ReactStatelessElement));
  console.log(document.body, hashIt(document.body));
  // console.log(window, hashIt(window));
};

const hashOnlyValidation = (iterations = 100) => {
  console.log(hashIt(object));
  console.log(hashIt(a));
  console.log(hashIt(object.string));
  console.log(hashIt(object.num));
  console.log(hashIt(object.bool));
  console.log(hashIt(object.func));
  console.log(hashIt(object.undef));
  console.log(hashIt(object.nil));
  console.log(hashIt(object.obj));
  console.log(hashIt(object.arr));
  console.log(hashIt(object.el));
  console.log(hashIt(object.math));
  console.log(hashIt(object.regexp));
  console.log(hashIt(object.symbol));
  
  // comment out for older browser testing
  console.log(hashIt(object.err));
  console.log(hashIt(object.map));
  console.log(hashIt(object.set));
  console.log(hashIt(object.weakMap));
  console.log(hashIt(object.weakSet));
  console.log(hashIt(object.arrayBuffer));
  console.log(hashIt(object.dataView));
  console.log(hashIt(object.float32Array));
  console.log(hashIt(object.float64Array));
  console.log(hashIt(object.generator));
  console.log(hashIt(object.int8Array));
  console.log(hashIt(object.int16Array));
  console.log(hashIt(object.int32Array));
  console.log(hashIt(object.promise));
  console.log(hashIt(object.uint8Array));
  console.log(hashIt(object.uint8ClampedArray));
  console.log(hashIt(object.uint16Array));
  console.log(hashIt(object.uint32Array));

  console.log(hashIt(object.ReactStatefulClass));
  console.log(hashIt(object.ReactStatefulElement));
  console.log(hashIt(object.ReactStatelessClass));
  console.log(hashIt(object.ReactStatelessElement));
  console.log(hashIt(document.body));
  // console.log(hashIt(window));
};

profile(10000);
// visualValidation();
// hashOnlyValidation();
