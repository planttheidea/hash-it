# hash-it

Fast and consistent hashCode for any object type

## Table of contents

- [hash-it](#hash-it)
  - [Table of contents](#table-of-contents)
  - [Usage](#usage)
  - [Overview](#overview)
  - [Hash consistency](#hash-consistency)
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

Yes, any object type. Primitives, ES2015 classes like `Symbol`, DOM elements (yes, you can even hash the `window` object if you want). Any object type. Here is the list of object classes that produce consistent, unique hashes based on their value:

- `Arguments`
- `Array`
- `ArrayBuffer`
- `AsyncFunction` (based on `toString`)
- `AsyncGeneratorFunction` (based on `toString`)
- `BigInt`
- `BigInt64Array`
- `BigUint64Array`
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

Sadly, yes, there are a few scenarios where internal values cannot be introspected for the object. In this case, the object is hashed based on its class type and reference.

- `Promise`
  - There is no way to obtain the values contained within due to its asynchronous nature
- `Generator` (the result of calling a `GeneratorFunction`)
  - Like `Promise`, there is no way to obtain the values contained within due to its dynamic iterable nature
- `WeakMap` / `WeakRef` / `WeakSet`
  - The spec explicitly forbids iteration over them, so the unique values cannot be discovered

```ts
const promise = Promise.resolve(123);

console.log(hash(promise)); // 16843037491939
console.log(hash(promise)); // 16843037491939
console.log(hash(Promise.resolve(123))); // 4622327363876
```

If there is an object class or data type that is missing, please submit an issue.

## Hash consistency

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
