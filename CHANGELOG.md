# hash-it CHANGELOG

## 7.1.1

### Enhancements

- Reworked `hash` to fold values directly into numeric accumulators instead of serializing the tree first, substantially
  reducing allocations and memory usage.
- Eliminated intermediate allocations for strings, numbers, and binary values.
- Peak heap usage is now 39–57% lower on object-heavy values.
- Improved hashing performance across nearly all value types, with speedups of up to ~56x:

| class                       |    speedup |
| --------------------------- | ---------: |
| `Uint8Array` (100k)         | **55.90x** |
| `Int32Array` (10k)          | **12.22x** |
| `Float64Array` (10k)        | **12.02x** |
| `BigInt64Array` (10k)       |  **9.93x** |
| `Array` (10k numbers)       |  **3.94x** |
| `DataView` (100k)           |  **3.91x** |
| `SharedArrayBuffer` (100k)  |  **3.69x** |
| `ArrayBuffer` (100k)        |  **3.68x** |
| `Object` (deep, 500 levels) |  **3.31x** |
| `Date`                      |  **3.17x** |
| `Array` (10k objects)       |  **3.06x** |
| `Array` (10k strings)       |  **2.98x** |
| `Object` (small)            |  **2.36x** |
| `Object` (circular)         |  **2.32x** |
| `Arguments`                 |  **2.20x** |
| `Symbol`                    |  **2.08x** |
| `Map` (5k)                  |  **2.06x** |
| `Number`                    |  **1.85x** |
| `Object` (1k keys)          |  **1.81x** |
| `Event`                     |  **1.79x** |
| `Function`                  |  **1.63x** |
| `RegExp`                    |  **1.57x** |
| `BigInt`                    |  **1.52x** |
| `String` (short)            |  **1.37x** |
| `Promise` (by reference)    |  **1.34x** |
| `DocumentFragment`          |  **1.31x** |
| `String` (1k)               |  **1.27x** |
| `null` / `undefined`        |  **1.26x** |
| `Error`                     |  **1.20x** |
| `HTMLElement`               |  **1.20x** |
| `Set` (5k)                  |  **0.96x** |
| `Boolean`                   |  **0.93x** |

- `Set` hashing is effectively unchanged because order-independent sorting remains the dominant cost.
- Added ~475 bytes minified and gzipped.

### Fixes

- Fixed four output bits carrying no information; all 53 output bits now respond uniformly to input changes, flipping
  49.5–50.4% of the time.

### Documentation

- `DataView` is hashed by the bytes within its view window, not by its entire underlying buffer.
- `Error` is hashed by its `message` as well as its `stack`.
- `Event` excludes `Event.srcElement` alongside `Event.timeStamp`.

## 7.1.0

### Enhancements

- [#106](https://github.com/planttheidea/hash-it/pull/106) - Added explicit `Float16Array` support.
- [#106](https://github.com/planttheidea/hash-it/pull/106) - Substantially improved `Map` and `Set` hashing performance.
- [#106](https://github.com/planttheidea/hash-it/pull/106) - Shared subtrees are now hashed once and reused rather than
  re-walked.
- [#106](https://github.com/planttheidea/hash-it/pull/106) - Added `Math.imul` support with an equivalent fallback,
  preserving existing runtime requirements.

### Fixes

- [#106](https://github.com/planttheidea/hash-it/pull/106) - Fixed plain objects with `Symbol.iterator` being hashed by
  reference instead of by value.
- [#106](https://github.com/planttheidea/hash-it/pull/106) - Fixed own array properties beyond indexed elements being
  omitted from hashes.
- [#106](https://github.com/planttheidea/hash-it/pull/106) - Fixed shared references being hashed by position rather
  than by value.
- [#106](https://github.com/planttheidea/hash-it/pull/106) - Fixed missing `Int32Array` class registration.
- [#106](https://github.com/planttheidea/hash-it/pull/106) - Fixed `SharedArrayBuffer` hashes ignoring contents and byte
  length.
- [#106](https://github.com/planttheidea/hash-it/pull/106) - Fixed `Symbol` hashes colliding with strings.
- [#106](https://github.com/planttheidea/hash-it/pull/106) - Fixed string content forging structural boundaries;
  content-bearing values are now length-delimited.
- [#106](https://github.com/planttheidea/hash-it/pull/106) - Fixed `Map` and `Set` hashes depending on insertion order
  when entries share object references.
- [#106](https://github.com/planttheidea/hash-it/pull/106) - Fixed boxed `BigInt` and `Symbol` values collapsing to the
  same hash.
- [#106](https://github.com/planttheidea/hash-it/pull/106) - Fixed hash entropy being limited to ~32 bits; combined
  hashes now use the full 53-bit range.
- [#106](https://github.com/planttheidea/hash-it/pull/106) - Fixed `ArrayBuffer` fallback detection checking
  `Uint16Array` instead of `Uint8Array`.

## 7.0.3

- [#102](https://github.com/planttheidea/hash-it/pull/102) - Fix `DataView` hash giving false positives with different
  byte ranges
- [#102](https://github.com/planttheidea/hash-it/pull/102) - Fix modern `ArrayBuffer` hashes giving false positives on
  invalid byte sequences
- [#102](https://github.com/planttheidea/hash-it/pull/102) - Fix fallback `ArrayBuffer` hashes throwing on large buffers
- [#102](https://github.com/planttheidea/hash-it/pull/102) - Fix RegExp matcher for DOM elements
- [#102](https://github.com/planttheidea/hash-it/pull/102) - Improve sort performance by using native `.sort()` instead
  of custom `sort` method

## 7.0.2

- [#79](https://github.com/planttheidea/hash-it/pull/79) - Explicit support for `Blob` (fixes
  [#78](https://github.com/planttheidea/hash-it/issues/78))

## 7.0.1

- Fix README not referencing the new named import

## 7.0.0

### Breaking changes

- Change default export to named `hash` import (necessary to allow cross-compatible types for `.d.cts` files)

## 6.0.1

- Fix CJS types masquerading as ESM when `Node16` module is used in TypeScript

## 6.0.0

### Breaking changes

- Equality utilities (`is` / `is.any` / `is.all` / `is.not`) are no longer provided
- `Error` type hashes now include the message (previously only included stack)
- Non-enumerable type hashes (`Generator`, `Promise`, `WeakMap`, `WeakSet`) now hash uniquely based on reference
- `WeakMap` is now required at runtime (used as cache for circular references)

### Enhancements

- Better support for system-specific loading (ESM vs CJS vs UMD)
- Added support for primitive wrappers (e.g. `new Number('123')`)
- Added support for more object classes
  - `AsyncFunction`
  - `AsyncGeneratorFunction`
  - `BigInt64Array`
  - `BigUint64Array`
  - `GeneratorFunction`
  - `SharedArrayBuffer`
  - `WeakRef` (same limitations as those for `WeakMap` / `WeakSet`)

## 5.0.2

- Reduce code size by 29.29% (19.42% gzipped size)
- Activate strict mode for typing

## 5.0.1

- Update `.npmignore` to reduce package tarball size ([#39](https://github.com/planttheidea/hash-it/pull/39))

## 5.0.0

### Breaking changes

- Remove autocurrying of `hash.is` methods
- Remove transpiled builds in favor of rollup distributed files (deep-linking will no longer work)

### Enhancements

- Codebase rewritten in TypeScript
- Added `BigInt` support

## 4.1.0

- Add TypeScript definitions
- Significant speed improvements

## 4.0.5

- Fix issues related to string encoding and collisions [#23](https://github.com/planttheidea/hash-it/issues/23)

## 4.0.4

- Improve speed of complex objects (Objects, Arrays, Maps, Sets)
- Fix security issue with old version of `webpack-dev-server`

## 4.0.3

- Upgrade to use babel 7 for builds

## 4.0.2

- Fix [#18](https://github.com/planttheidea/hash-it/pull/18) - IE11 not allowing global `toString` to be used, instead
  using `Object.prototype.toString` (thanks [@JorgenEvens](https://github.com/JorgenEvens))

## 4.0.1

- Remove unused values from publish

## 4.0.0

Rewrite! Lots of changes under-the-hood for a much more consistent hash, and circular object handling out of the box.

### Breaking changes

- `isEmpty`, `isEqual`,`isNull`, and `isUndefined` have been removed (all can be reproduced with new `is` and `is.all`
  functions)
  - `hash.isNull` => `hash.is(null)`
  - `hash.isUndefined` => `hash.is(undefined)`
  - `hash.isEqual` => `hash.is.all`
  - `hash.isEmpty` => `(object) => hash.is.any(object, undefined, null, '', 0, [], {}, new Map(), new Set())`
- `Error` hashes now based on `error.stack` instead of `error.message`

### Enhancements

- Circular objects are now handled out of the box, thanks to
  [`fast-stringify`](https://github.com/planttheidea/fast-stringify)
- Collision rates are near-zero (previously used traditional DJB2, which has small collision rates)
- Better `ArrayBuffer` support with the use of `Buffer.from` when supported
- SVG elements, DocumentFragments, and Events are now supported
- `is` partial-application function allows for easy creation of any type of `isEqual` comparison method
- `is.any` performs the same multiple-object check that `is.all` does, but only checks if one of the other objects is
  equal
- `is.not` performs the same comparison that `is` does, but checks for non-equality

#### FIXES

- `Object` / `Map` / `Set` no longer returns different hashes based on order of key addition
- `hash.isEqual` will no longer fail if nothing is passed

## 3.1.2

- Remove extraneous `toString` call (performance)

## 3.1.1

- Improve hash uniqueness for HTML elements

## 3.1.0

- Add support for `Generator` (not just `GeneratorFunction`)
- Streamline `typeof`- vs `toString`-driven handling for improved speed for most types

## 3.0.0

- Improve speed (2-4x faster depending on type)
- Smaller footprint (~25% reduction)
- Improve hash accuracy for functions (hash now includes function body)
- Fix issue where stack remained in memory after hash was built
- Add ES transpilation for module-ready build tools

### Breaking changes

- If using CommonJS, you need to specify `require('hash-it').default` instead of just `require('hash-it')`
- Hashes themselves may have changed (especially for circular objects)
- Removed `isRecursive` method on `hashIt` object (which was wrongly named to begin with)
  - To specifically handle _circular_ objects (which is what it really did), pass `true` as the second parameter to
    `hashIt`

## 2.1.2

- Move up isNull check in replacer (improve performance of more likely use-case)

## 2.1.1

- Create isNull utility instead of checking strict equality in multiple places

## 2.1.0

- Overall speed improvement by an average of 18.74% (35.27% improvement on complex objects)

## 2.0.1

- More speed improvements

## 2.0.0

- Use JSON.stringify with replacer as default, without try/catch
- Move use of try/catch with fallback to prune to new `hashIt.withRecursion` method (only necessary for deeply-recursive
  objects like `window`)
- Reorder switch statement for commonality of use cases
- Leverage typeof in switch statements when possible for performance

## 1.3.1

- Add optimize-js plugin for performance in script version

## 1.3.0

- Add hashIt.isUndefined, hashIt.isNull, and hashIt.isEmpty methods
- Reorder switch statements in replacer and getValueForStringification to reflect most likely to least likely (improves
  performance a touch)
- Remove "Number" from number stringification
- Leverage prependTypeToString whereever possible
- Include Arguments object class

## 1.2.1

- Calculation of Math hashCode now uses properties
- Fix README

## 1.2.0

- Add hashIt.isEqual method to test for equality
- Prepend all values not string or number with object class name to help avoid collision with equivalent string values

## 1.1.0

- Add support for a variety of more object types
- Fix replacer not using same stringifier for int arrays

## 1.0.0

- Initial release
