# hashIt

Fast and consistent hashCode for any object type

## Table of contents

- [Usage](#usage)
- [Overview](#overview)
- [Utility functions](#utility-functions)
  - [isEmpty](#isempty)
  - [isEqual](#isequal)
  - [isNull](#isnull)
  - [isUndefined](#isundefined)
- [Gotchas](#gotchas)
- [Browser support](#browser-support)
- [Node support](#node-support)
- [Development](#development)

## Usage

```javascript
// ES2015
import hashIt from "hash-it";

// CommonJS
const hashIt = require("hash-it").default;

// script
const hashIt = window.hashIt;

// hash any standard object
console.log(hashIt({ foo: "bar" })); // 2639617176

// or a circular object
console.log(hashIt(window)); // 482488043
```

## Overview

`hashIt` has a simple goal: provide a fast, consistent, unique hashCode for any object type that is uniquely based on its values. This has a number of uses such as duplication prevention, equality comparisons, blockchain construction, etc.

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

#### isEmpty

`isEmpty(object: any): boolean`

Determines if object is empty based on hashCode, with empty defined as:

- Empty array (`[]`)
- Empty map (`new Map()`)
- Empty object (`{}`)
- Empty set (`new Set()`)
- Empty string (`''`)
- Undefined (`undefined`)
- Null (`null`)

This differs from the implementation by `lodash`, where a value is considered not empty if an `Array`, `Object`, `Map`, or `Set`. Think of this definition of empty as "having no value(s)".

#### isEqual

`isEqual(object1: any, object2: any[, object3: any[, ...objectN]]): boolean`

Compares all objects passed to it to determine if they are equal to one another based on hashCode

```javascript
const foo = {
  foo: "bar"
};
const alsoFoo = {
  foo: "bar"
};

console.log(foo === alsoFoo); // false
console.log(hashIt.isEqual(foo, alsoFoo)); // true
```

#### isNull

`isNull(object: any): boolean`

Determines if object is null based on hashCode

#### isUndefined

`isUndefined(object: any): boolean`

Determines if object is undefined based on hashCode

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
