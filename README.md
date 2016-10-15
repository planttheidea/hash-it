# hashIt

Fast and consistent hashCode for any object type

### Installation

```
$ npm i hash-it --save
```

### Usage

```javascript
// ES2015
import hashIt from 'hash-it';

// CommonJS
const hashIt = require('hash-it');

// script
const hashIt = window.hashIt;

const hashedObject = hashIt({
  foo: 'bar'
});

console.log(hashedObject);
// 2196683918
```

### Overview

`hashIt` has a simple goal: provide a fast and consistent hashCode for any object type that is uniquely based on its values. This has a number of uses such as duplication prevention or fast equality comparisons.

*Any object type?*

Yes, any object type. Primitives, ES2015 classes like `Symbol`, DOM elements (yes, you can even hash the `window` object if you want). Any object type.

*With no exceptions?*

Well ... sadly, no, there are a few exceptions.
* `Promise`
  * There is no way to obtain the values contained within due to its asynchronous nature
* `WeakMap` / `WeakSet`
  * The spec explicitly forbids iteration over them, so the unique values cannot be discovered
  
In each of these cases, no matter what the values of the object, they will always yield the same hash result, which is unique to each object type. If you have any ideas about how these can be uniquely hashed, I welcome them!

Here is the list of object classes that have been tested and shown to produce unique hashCodes:
* `Arguments`
* `Array`
* `ArrayBuffer`
* `Boolean`
* `DataView`
* `Date` (based on `valueOf`)
* `Error` (based on `message`)
* `Float32Array`
* `Float64Array`
* `Function` (based on `name` and `arguments`)
* `GeneratorFunction` (based on `name` and `arguments`)
* `Int8Array`
* `Int16Array`
* `Int32Array`
* `HTMLElement` (based on `textContent`, includes all sub-types, e.g. `HTMLAnchorElement`, `HTMLDivElement`, etc)
* `Map`
* `Math` (based on `E`, `LN2`, `LN10`, `LOG2E`, `LOG10E`, `PI`, `SQRT1_2`, and `SQRT2`)
* `Null`
* `Number`
* `Object` (can handle recursive objects)
* `Proxy`
* `RegExp`
* `Set`
* `String`
* `Symbol`
* `Uint8Array`
* `Uint8ClampedArray`
* `Uint16Array`
* `Uint32Array`
* `Undefined`
* `Window`

This is basically all I could think of, but if I have missed an object class let me know and I will add it!

### Utility functions

**withRecursion(object)** *returns `Number`*

Performs the same kind of hashing, but handles very deep recursion on objects (such as the `window` object).

**isEmpty(object)** *returns `Boolean`*

Determines if object is empty based on hashCode, with empty defined as:
* Empty array (`[]`)
* Empty map (`new Map()`)
* Empty number, or zero (`0`)
* Empty object (`{}`)
* Empty set (`new Set()`)
* Empty string (`''`)
* Undefined (`undefined`)
* Null (`null`)

This differs from the implementation by `lodash`, where a value is considered empty if they it is not an `Array`, `Object`, `Map`, or `Set`. Think of this definition of empty as "having no value(s)".

**isEqual(object1, object2[, object3, ..., objectN])** *returns `Boolean`*

Compares all objects passed to it to determine if they are equal to one another based on hashCode
  
```javascript
const foo = {
    foo: 'bar'
};
const alsoFoo = {
    foo: 'bar'
};

console.log(foo === alsoFoo); // false
console.log(hashIt.isEqual(foo, alsoFoo)); // true
```

**isNull(object)** *returns `Boolean`*

Determines if object is null based on hashCode

**isUndefined(object)** *returns `Boolean`*

Determines if object is undefined based on hashCode

### Gotchas

While the hashes will be consistent when calculated within the same browser environment, there is no guarantee that the hashCode will be the same across different browsers due to browser-specific implementations of features. A vast majority of the time things line up, but there are some edge cases that cause differences, so just something to be mindful of.

### Support

`hashIt` has been tested on the following browsers:
* Chrome
* Firefox
* Opera
* Edge
* IE9+

There are no DOM dependencies, so `hashIt` should work in Node as well.

### Development

Standard stuff, clone the repo and `npm i` to get the dependencies. npm scripts available:
* `build` => builds the distributed JS with `NODE_ENV=development` and with sourcemaps
* `build-minified` => builds the distributed JS with `NODE_ENV=production` and minified
* `compile-for-publish` => runs the `lint`, `test`, `transpile`, `dist` scripts
* `dev` => runs the webpack dev server for the playground
* `dist` => runs the `build` and `build-minified`
* `lint` => runs ESLint against files in the `src` folder
* `prepublish` => if in publish, runs `compile-for-publish`
* `test` => run ava with NODE_ENV=test
* `test:watch` => runs `test` but with persistent watcher
* `transpile` => runs Babel against files in `src` to files in `lib`
