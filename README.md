# hash-it

Fast and consistent hashCode for any object type

## Table of contents

- [hash-it](#hash-it)
  - [Table of contents](#table-of-contents)
  - [Usage](#usage)
  - [Overview](#overview)
  - [Guarantees](#guarantees)
    - [Consistency](#consistency)
    - [Equality](#equality)
  - [Support](#support)
  - [Development](#development)

## Usage

```javascript
// ES2015
import { hash } from 'hash-it';

// CommonJS
const { hash } = require('hash-it');

// hash any standard object
console.log(hash({ foo: 'bar' })); // 1663244226405536

// or a circular object
console.log(hash(window)); // 3557759737121602
```

## Overview

`hash-it` has a simple goal: provide a fast, consistent, unique hashCode for any object type that is uniquely based on
its values. This has a number of uses such as duplication prevention, equality comparisons, blockchain construction,
etc.

_Any object type?_

Yes, any object type. Primitives, ES2015 classes like `Symbol`, DOM elements (yes, you can even hash the `window` object
if you want). Any object type. Here is the list of object classes that produce consistent, unique hashes based on their
value:

- `Arguments`
- `Array`
- `ArrayBuffer`
- `AsyncFunction` (based on `toString`)
- `AsyncGeneratorFunction` (based on `toString`)
- `BigInt`
- `BigInt64Array`
- `BigUint64Array`
- `Boolean`
- `DataView` (based on the bytes within its view window)
- `Date` (based on `getTime`)
- `DocumentFragment` (based on `outerHTML` of all `children`)
- `Error` (based on `message` and `stack`)
  - Includes all sub-types (e.g., `TypeError`, `ReferenceError`, etc.)
- `Event` (based on all properties other than `Event.timeStamp` and `Event.srcElement`)
  - Includes all sub-types (e.g., `MouseEvent`, `KeyboardEvent`, etc.)
- `Float16Array`
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
- `SharedArrayBuffer`
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

_Are there any exceptions?_

Sadly, yes, there are a few scenarios where internal values cannot be introspected for the object. In this case, the
object is hashed based on its class type and reference.

- `Promise`
  - There is no way to synchronously obtain the values contained within due to its asynchronous nature
- `Blob`
  - Like `Promise`, there is no way to synchronously obtain the values contained within
- `Generator` (the result of calling a `GeneratorFunction`)
  - Like `Promise`, there is no way to obtain the values contained within due to its dynamic iterable nature
- `WeakMap` / `WeakRef` / `WeakSet`
  - The spec explicitly forbids iteration over them, so the unique values cannot be discovered

```ts
const promise = Promise.resolve(123);

console.log(hash(promise)); // 8959449433830577
console.log(hash(promise)); // 8959449433830577
console.log(hash(Promise.resolve(123))); // 2215269628940933
```

If there is an object class or data type that is missing, please submit an issue.

## Guarantees

### Consistency

While the hashes will be consistent when calculated within the same environment, there is no guarantee that the
resulting hash will be the same across different environments due to environment-specific or browser-specific
implementations of features. This is limited to extreme edge cases, such as hashing the `window` object, but should be
considered if being used with persistence over different environments.

The same applies across versions of `hash-it` itself: the value produced for a given input may change between releases
as the algorithm is refined. Hashes are intended for comparison within a single running program, not for persistence.

### Equality

A few specifics are worth calling out:

- `0` and `-0` produce the same hash, as do two `NaN` values, using
  [`SameValueZero`](https://tc39.es/ecma262/#sec-samevaluezero) comparison.
- A hole in a sparse array is treated as `undefined`, so `[, ,]` and `[undefined, undefined]` produce the same hash.
- Enumerable own properties added to an array beyond its indices are included in its hash, on the same terms as a plain
  object.

## Support

An ES2015 environment is required; the published bundles are emitted as ES2015 syntax and use ES2015 built-ins such as
`WeakMap`.

## Development

Clone the repo and dependencies via `yarn`. The npm scripts available:

- `benchmark` => run benchmark of various data types
- `benchmark:compare` => run benchmark of some data types comparing against other hashing modules
- `build` => run `build:es`, `build:cjs`, and `build:umd` scripts
- `build:cjs` => run rollup to build `cjs` files
- `build:es` => run rollup to build `es` files
- `build:umd` => run rollup to build `umd` files
- `clean` => remove files produced from `build` script
- `clean:cjs` => remove files produced from `build:cjs` script
- `clean:es` => remove files produced from `build:es` script
- `clean:umd` => remove files produced from `build:umd` script
- `dev` => run dev server to run example app / playground
- `format` => run `prettier` to format repo
- `format:check` => run `prettier` to validate formatting in repo
- `lint` => run ESLint against all files in the `src` folder
- `lint:fix` => run `lint` script, automatically applying fixable changes
- `release:alpha` => release a new `alpha` version under the `next` tag
- `release:beta` => release a new `beta` version under the `next` tag
- `release:rc` => release a new `rc` version under the `next` tag
- `release:stable` => release a new stable version under the `latest` tag
- `start` => alias for `dev` script
- `test` => run jest test functions with `NODE_ENV=test`
- `typecheck` => run `tsc` to validate internal typings
