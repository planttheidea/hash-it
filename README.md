# hash-it

Fast and consistent hashCode for any object type

## Table of contents

- [Usage](#usage)
- [Overview](#overview)
- [Utility functions](#utility-functions)
  - [is](#is)
  - [is.all](#isall)
  - [is.any](#isany)
  - [is.not](#isnot)
- [Gotchas](#gotchas)
- [Browser support](#browser-support)
- [Node support](#node-support)
- [Development](#development)

## Usage

```javascript
// ES2015
import hash from "hash-it";

// CommonJS
const hash = require("hash-it").default;

// script
const hash = window.hashIt;

// hash any standard object
console.log(hash({ foo: "bar" })); // 8999940026732

// or a circular object
console.log(hash(window)); // 6514964902729
```

## Overview

`hash-it` has a simple goal: provide a fast, consistent, unique hashCode for any object type that is uniquely based on its values. This has a number of uses such as duplication prevention, equality comparisons, blockchain construction, etc.

_Any object type?_

Yes, any object type. Primitives, ES2015 classes like `Symbol`, DOM elements (yes, you can even hash the `window` object if you want). Any object type.

_With no exceptions?_

Well ... sadly, no, there are a few exceptions.

- `Promise`
  - There is no way to obtain the values contained within due to its asynchronous nature
- `Generator` (the result of calling a `GeneratorFunction`)
  - Like `Promise`, there is no way to obtain the values contained within due to its dynamic iterable nature
- `WeakMap` / `WeakSet`
  - The spec explicitly forbids iteration over them, so the unique values cannot be discovered

In each of these cases, no matter what the values of the object, they will always yield the same hash result, which is unique to each object type. If you have any ideas about how these can be uniquely hashed, I welcome them!

Here is the list of object classes that have been tested and shown to produce unique hashCodes:

- `Arguments`
- `Array`
- `ArrayBuffer`
- `AsyncFunction` (based on `toString`)
- `Boolean`
- `DataView` (based on its `buffer`)
- `Date` (based on `getTime`)
- `DocumentFragment` (based on `outerHTML` of all `children`)
- `Error` (based on `stack`)
  - Includes all sub-types (e.g., `TypeError`, `ReferenceError`, etc.)
- `Event` (based on all properties other than `Event.timeStamp`)
  - Includes all sub-types (e.g., `MouseEvent`, `KeyboardEvent`, etc.)
- `Float32Array`
- `Float64Array`
- `Function` (based on `toString`)
- `GeneratorFunction` (based on `toString`)
- `Int8Array`
- `Int16Array`
- `Int32Array`
- `HTMLElement` (based on `outerHTML`)
  - Includes all sub-types (e.g., `HTMLAnchorElement`, `HTMLDivElement`, etc.)
- `Map` (order-agnostic)
- `Null`
- `Number`
- `Object` (handles circular objects, order-agnostic)
- `Proxy`
- `RegExp`
- `Set` (order-agnostic)
- `String`
- `SVGElement` (based on `outerHTML`)
  - Includes all sub-types (e.g., `SVGRectElement`, `SVGPolygonElement`, etc.)
- `Symbol` (based on `toString`)
- `Uint8Array`
- `Uint8ClampedArray`
- `Uint16Array`
- `Uint32Array`
- `Undefined`
- `Window`

This is basically all I could think of, but if I have missed an object class let me know and I will add it!

## Utility functions

#### is

`is(object: any, otherObject: any): boolean`

Compares the two objects to determine equality.

```javascript
console.log(hash.is(null, 123)); // false
console.log(hash.is(null, null)); // true
```

**NOTE**: This can also be used with partial-application to create prepared equality comparators.

```javascript
const isNull = hash.is(null);

console.log(isNull(123)); // false
console.log(isNull(null)); // true
```

#### is.all

`is.all(object1: any, object2: any[, object3: any[, ...objectN]]): boolean`

Compares the first object to all other objects passed to determine if all are equal based on hashCode

```javascript
const foo = {
  foo: "bar"
};
const alsoFoo = {
  foo: "bar"
};
const stillFoo = {
  foo: "bar"
};

console.log(hash.is.all(foo, alsoFoo)); // true
console.log(hash.is.all(foo, alsoFoo, stillFoo)); // true
```

**NOTE**: This can also be used with partial-application to create prepared equality comparators.

```javascript
const foo = {
  foo: "bar"
};
const alsoFoo = {
  foo: "bar"
};
const stillFoo = {
  foo: "bar"
};

const isAllFoo = hash.is.all(foo);

console.log(isAllFoo(alsoFoo, stillFoo)); // true
```

#### is.any

`is.any(object1: any, object2: any[, object3: any[, ...objectN]]): boolean`

Compares the first object to all other objects passed to determine if any are equal based on hashCode

```javascript
const foo = {
  foo: "bar"
};
const alsoFoo = {
  foo: "bar"
};
const nopeBar = {
  bar: "baz"
};

console.log(hash.is.any(foo, alsoFoo)); // true
console.log(hash.is.any(foo, nopeBar)); // false
console.log(hash.is.any(foo, alsoFoo, nopeBar)); // true
```

**NOTE**: This can also be used with partial-application to create prepared equality comparators.

```javascript
const foo = {
  foo: "bar"
};
const alsoFoo = {
  foo: "bar"
};
const nopeBar = {
  bar: "baz"
};

const isAnyFoo = hash.is.any(foo);

console.log(isAnyFoo(alsoFoo, nopeBar)); // true
```

#### is.not

`is.not(object: any, otherObject: any): boolean`

Compares the two objects to determine non-equality.

```javascript
console.log(hash.is.not(null, 123)); // true
console.log(hash.is.not(null, null)); // false
```

**NOTE**: This can also be used with partial-application to create prepared equality comparators.

```javascript
const isNotNull = hash.is.not(null);

console.log(isNotNull(123)); // true
console.log(isNotNull(null)); // flse
```

## Gotchas

While the hashes will be consistent when calculated within the same browser environment, there is no guarantee that the hashCode will be the same across different browsers due to browser-specific implementations of features. A vast majority of the time things line up, but there are some edge cases that can cause differences, so just something to be mindful of.

## Browser support

- Chrome (all versions)
- Firefox (all versions)
- Edge (all versions)
- Opera 15+
- IE 9+
- Safari 6+
- iOS 8+
- Android 4+

## Node support

- 4+

## Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:

- `build` => run webpack to build development `dist` file with NODE_ENV=development
- `build:minified` => run webpack to build production `dist` file with NODE_ENV=production
- `dev` => run webpack dev server to run example app / playground
- `dist` => runs `build` and `build:minified`
- `lint` => run ESLint against all files in the `src` folder
- `prepublish` => runs `prepublish:compile` when publishing
- `prepublish:compile` => run `lint`, `test:coverage`, `transpile:es`, `transpile:lib`, `dist`
- `test` => run AVA test functions with `NODE_ENV=test`
- `test:coverage` => run `test` but with `nyc` for coverage checker
- `test:watch` => run `test`, but with persistent watcher
- `transpile:lib` => run babel against all files in `src` to create files in `lib`
- `transpile:es` => run babel against all files in `src` to create files in `es`, preserving ES2015 modules (for
  [`pkg.module`](https://github.com/rollup/rollup/wiki/pkg.module))
