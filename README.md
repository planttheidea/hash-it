# hash-it

Fast and consistent hashCode for any object type

## Table of contents

- [hash-it](#hash-it)
  - [Table of contents](#table-of-contents)
  - [Usage](#usage)
  - [Overview](#overview)
  - [Equality methods](#equality-methods)
    - [hash.is](#hashis)
    - [hash.is.all](#hashisall)
    - [hash.is.any](#hashisany)
    - [hash.is.not](#hashisnot)
  - [Note](#note)
  - [Support](#support)
    - [Browsers](#browsers)
    - [Node](#node)
  - [Development](#development)

## Usage

```javascript
// ES2015
import hash from 'hash-it';

// CommonJS
const hash = require('hash-it');

// hash any standard object
console.log(hash({ foo: 'bar' })); // 13729774857125

// or a circular object
console.log(hash(window)); // 3270731309314
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

In each of these cases, no matter what the values of the object, they will always yield the same hash result, which is unique to each object type. If you have any ideas about how these can be uniquely hashed, they are welcome!

Here is the list of object classes that produce unique hashes:

- `Arguments`
- `Array`
- `ArrayBuffer`
- `AsyncFunction` (based on `toString`)
- `BigInt`
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

If there is an object class or data type that is missing, please submit an issue.

## Equality methods

### hash.is

`hash.is(value1: any, value2: any): boolean`

Compares the two objects to determine equality.

```javascript
console.log(hash.is(null, 123)); // false
console.log(hash.is(null, null)); // true
```

### hash.is.all

`hash.is.all(value1: any, value2: any[, value3: any[, ...valueN]]): boolean`

Compares the first object to all other objects passed to determine if all are equal based on hashCode

```javascript
const foo = {
  foo: 'bar',
};
const alsoFoo = {
  foo: 'bar',
};
const stillFoo = {
  foo: 'bar',
};

console.log(hash.is.all(foo, alsoFoo)); // true
console.log(hash.is.all(foo, alsoFoo, stillFoo)); // true
```

### hash.is.any

`hash.is.any(value1: any, value2: any[, value3: any[, ...valueN]]): boolean`

Compares the first object to all other objects passed to determine if any are equal based on hashCode

```javascript
const foo = {
  foo: 'bar',
};
const alsoFoo = {
  foo: 'bar',
};
const nopeBar = {
  bar: 'baz',
};

console.log(hash.is.any(foo, alsoFoo)); // true
console.log(hash.is.any(foo, nopeBar)); // false
console.log(hash.is.any(foo, alsoFoo, nopeBar)); // true
```

### hash.is.not

`hash.is.not(value1: any, value2: any): boolean`

Compares the two objects to determine non-equality.

```javascript
console.log(hash.is.not(null, 123)); // true
console.log(hash.is.not(null, null)); // false
```

## Note

While the hashes will be consistent when calculated within the same environment, there is no guarantee that the resulting hash will be the same across different environments due to environment-specific or browser-specific implementations of features. This is limited to extreme edge cases, such as hashing the `window` object, but should be considered if being used with persistence over different environments.

## Support

### Browsers

- Chrome (all versions)
- Firefox (all versions)
- Edge (all versions)
- Opera 15+
- IE 9+
- Safari 6+
- iOS 8+
- Android 4+

### Node

- 4+

## Development

Clone the repo and dependencies via `yarn`. The npm scripts available:

- `benchmark` => run benchmark of various data types
- `benchmark:compare` => run benchmark of some data types comparing against other hashing modules
- `build` => run rollup to build ESM, CJS, and UMD files
- `clean` => remove files produced from `build` script
- `dev` => run webpack dev server to run example app / playground
- `lint` => run ESLint against all files in the `src` folder
- `lint:fix` => run `lint` script, automatically applying fixable changes
- `prepublishOnly` => run `typecheck`, `lint`, `test`, and `build`
- `start` => alias for `dev` script
- `test` => run jest test functions with `NODE_ENV=test`
- `test:coverage` => run `test` with coverage checker
- `test:watch` => run `test` with persistent watcher
- `typecheck` => run `tsc` to validate internal typings
