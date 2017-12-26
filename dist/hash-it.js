(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("hashIt", [], factory);
	else if(typeof exports === 'object')
		exports["hashIt"] = factory();
	else
		root["hashIt"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(2);
var _EMPTY_HASHES;



/**
 * @function hashIt
 *
 * @description
 * return the unique integer hash value for the object
 *
 * @param {*} object the object to hash
 * @param {boolean} [isCircular] is the object a circular object
 * @returns {number}
 */
var hashIt = function hashIt(object, isCircular) {
  var stringifiedValue = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* getStringifiedValue */])(object, isCircular);

  return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* getIntegerHashValue */])(stringifiedValue);
};

var UNDEFINED_HASH = hashIt(undefined);
var NULL_HASH = hashIt(null);
var EMPTY_ARRAY_HASH = hashIt([]);
var EMPTY_MAP_HASH = hashIt(new Map());
var EMPTY_NUMBER_HASH = hashIt(0);
var EMPTY_OBJECT_HASH = hashIt({});
var EMPTY_SET_HASH = hashIt(new Set());
var EMPTY_STRING_HASH = hashIt('');

var EMPTY_HASHES = (_EMPTY_HASHES = {}, _EMPTY_HASHES[EMPTY_ARRAY_HASH] = true, _EMPTY_HASHES[EMPTY_MAP_HASH] = true, _EMPTY_HASHES[EMPTY_NUMBER_HASH] = true, _EMPTY_HASHES[EMPTY_OBJECT_HASH] = true, _EMPTY_HASHES[EMPTY_SET_HASH] = true, _EMPTY_HASHES[EMPTY_STRING_HASH] = true, _EMPTY_HASHES[NULL_HASH] = true, _EMPTY_HASHES[UNDEFINED_HASH] = true, _EMPTY_HASHES);

/**
 * @function hashIt.isEqual
 *
 * @description
 * determine if all objects passed are equal in value to one another
 *
 * @param {...Array<*>} objects the objects to test for equality
 * @returns {boolean} are the objects equal
 */
hashIt.isEqual = function () {
  for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
    objects[_key] = arguments[_key];
  }

  var length = objects.length;

  if (length === 1) {
    throw new Error('isEqual requires at least two objects to be passed for comparison.');
  }

  for (var index = 1; index < length; index++) {
    if (hashIt(objects[index - 1]) !== hashIt(objects[index])) {
      return false;
    }
  }

  return true;
};

/**
 * @function hashIt.isEmpty
 *
 * @description
 * determine if object is empty, meaning it is an array / object / map / set with values populated,
 * or is a string with no length, or is undefined or null
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object empty
 */
hashIt.isEmpty = function (object) {
  return !!EMPTY_HASHES[hashIt(object)];
};

/**
 * @function hashIt.isNull
 *
 * @description
 * determine if object is null
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object null
 */
hashIt.isNull = function (object) {
  return hashIt(object) === NULL_HASH;
};

/**
 * @function hashIt.isUndefined
 *
 * @description
 * determine if object is undefined
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object undefined
 */
hashIt.isUndefined = function (object) {
  return hashIt(object) === UNDEFINED_HASH;
};

/* harmony default export */ __webpack_exports__["default"] = (hashIt);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export toString */
/* unused harmony export getIterablePairs */
/* unused harmony export getStringFromArrayBuffer */
/* unused harmony export getTypePrefixedString */
/* unused harmony export getStringifiedValueByObjectClass */
/* unused harmony export getValueForStringification */
/* unused harmony export getRecursiveStackValue */
/* unused harmony export createReplacer */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getIntegerHashValue; });
/* unused harmony export tryCatch */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getStringifiedValue; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_json_prune__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_json_prune___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_json_prune__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(4);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// external dependencies


// constants


/**
 * get the toString value of object
 *
 * @param {*} object
 * @returns {string}
 */
var toString = function toString(object) {
  return Object.prototype.toString.call(object);
};

/**
 * @function getIterablePairs
 *
 * @description
 * get the [key,value] pairs for maps and sets
 *
 * @param {Map|Set} iterable the iterable to map
 * @param {string} type the type of object class
 * @returns {Array<Array>} the [key, value] pairs
 */
var getIterablePairs = function getIterablePairs(iterable, type) {
  var pairs = [__WEBPACK_IMPORTED_MODULE_1__constants__["c" /* OBJECT_CLASS_MAP */][type]];

  iterable.forEach(function (item, key) {
    pairs.push([key, item]);
  });

  return pairs;
};

/**
 * @function getStringFromArrayBuffer
 *
 * @description
 * get the string value of the buffer passed
 *
 * @param {ArrayBuffer} buffer the array buffer to convert
 * @returns {string} the stringified buffer
 */
var getStringFromArrayBuffer = function getStringFromArrayBuffer(buffer) {
  return typeof Uint16Array === 'undefined' ? '' : String.fromCharCode.apply(null, new Uint16Array(buffer));
};
/**
 * @function getTypePrefixedString
 *
 * @description
 * prepend type to string value
 *
 * @param {string} string the string to prepend
 * @param {string} type the type to add as a prefix
 * @returns {string} the prefixed string
 */
var getTypePrefixedString = function getTypePrefixedString(string, type) {
  return __WEBPACK_IMPORTED_MODULE_1__constants__["c" /* OBJECT_CLASS_MAP */][type] + ' ' + string;
};

/**
 * @function getStringifiedValueByObjectClass
 *
 * @description
 * get the stringified value of the object based based on its toString class
 *
 * @param {*} object the object to get the stringification value for
 * @returns {*} the value to stringify with
 */
var getStringifiedValueByObjectClass = function getStringifiedValueByObjectClass(object) {
  var objectClass = toString(object);

  if (~__WEBPACK_IMPORTED_MODULE_1__constants__["m" /* STRINGIFY_SELF_CLASSES */].indexOf(objectClass)) {
    return object;
  }

  if (~__WEBPACK_IMPORTED_MODULE_1__constants__["j" /* STRINGIFY_PREFIX_CLASSES */].indexOf(objectClass) || object === null) {
    return getTypePrefixedString(object, objectClass);
  }

  if (objectClass === __WEBPACK_IMPORTED_MODULE_1__constants__["d" /* OBJECT_CLASS_TYPE_MAP */].DATE) {
    return getTypePrefixedString(object.valueOf(), objectClass);
  }

  if (~__WEBPACK_IMPORTED_MODULE_1__constants__["h" /* STRINGIFY_ITERABLE_CLASSES */].indexOf(objectClass)) {
    return getIterablePairs(object, objectClass);
  }

  if (~__WEBPACK_IMPORTED_MODULE_1__constants__["i" /* STRINGIFY_NOT_ENUMERABLE_CLASSES */].indexOf(objectClass)) {
    return getTypePrefixedString('NOT_ENUMERABLE', objectClass);
  }

  if (objectClass === __WEBPACK_IMPORTED_MODULE_1__constants__["d" /* OBJECT_CLASS_TYPE_MAP */].ARRAYBUFFER) {
    return getTypePrefixedString(getStringFromArrayBuffer(object), objectClass);
  }

  if (objectClass === __WEBPACK_IMPORTED_MODULE_1__constants__["d" /* OBJECT_CLASS_TYPE_MAP */].DATAVIEW) {
    return getTypePrefixedString(getStringFromArrayBuffer(object.buffer), objectClass);
  }

  if (~__WEBPACK_IMPORTED_MODULE_1__constants__["k" /* STRINGIFY_PREFIX_JOIN_CLASSES */].indexOf(objectClass)) {
    return getTypePrefixedString(object.join(','), objectClass);
  }

  if (objectClass === __WEBPACK_IMPORTED_MODULE_1__constants__["d" /* OBJECT_CLASS_TYPE_MAP */].MATH) {
    return __WEBPACK_IMPORTED_MODULE_1__constants__["b" /* MATH_OBJECT */];
  }

  return __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* HTML_ELEMENT_REGEXP */].test(objectClass) ? __WEBPACK_IMPORTED_MODULE_1__constants__["c" /* OBJECT_CLASS_MAP */][__WEBPACK_IMPORTED_MODULE_1__constants__["d" /* OBJECT_CLASS_TYPE_MAP */].HTMLELEMENT] + ' ' + object.textContent : object;
};

/**
 * @function getValueForStringification
 *
 * @description
 * get the string value for the object used for stringification
 *
 * @param {*} object the object to get the stringification value for
 * @returns {*} the value to stringify with
 */
var getValueForStringification = function getValueForStringification(object) {
  var type = typeof object === 'undefined' ? 'undefined' : _typeof(object);

  if (~__WEBPACK_IMPORTED_MODULE_1__constants__["n" /* STRINGIFY_SELF_TYPES */].indexOf(type)) {
    return object;
  }

  if (~__WEBPACK_IMPORTED_MODULE_1__constants__["l" /* STRINGIFY_PREFIX_TYPES */].indexOf(type)) {
    return getTypePrefixedString(object, toString(object));
  }

  if (~__WEBPACK_IMPORTED_MODULE_1__constants__["o" /* STRINGIFY_TOSTRING_TYPES */].indexOf(type)) {
    return object.toString();
  }

  return getStringifiedValueByObjectClass(object);
};

/**
 * @function getRecursiveStackValue
 *
 * @description
 * get the value either from the recursive storage stack
 * or itself after being added to that stack
 *
 * @param {*} value the value to check for existing
 * @param {string} type the type of the value
 * @param {Array<*>} stack the current stack of values
 * @param {number} recursiveCounter the counter of circular references
 * @returns {*} the value to apply
 */
var getRecursiveStackValue = function getRecursiveStackValue(value, type, stack, recursiveCounter) {
  if (!value) {
    return getTypePrefixedString(value, type);
  }

  if (recursiveCounter > __WEBPACK_IMPORTED_MODULE_1__constants__["e" /* RECURSIVE_COUNTER_CUTOFF */]) {
    stack.length = 0;

    return value;
  }

  var existingIndex = stack.indexOf(value);

  if (!~existingIndex) {
    stack.push(value);

    return value;
  }

  return '*Circular-' + existingIndex;
};

/**
 * @function createReplacer
 *
 * @description
 * create the replacer function leveraging closure for recursive stack storage
 *
 * @param {Array<*>} stack the stack to store in memory
 * @returns {function} the replacer to use
 */
var createReplacer = function createReplacer(stack) {
  var recursiveCounter = 1,
      type = void 0,
      objectClass = void 0;

  return function (key, value) {
    if (!key) {
      stack = [value];

      return value;
    }

    type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

    if (~__WEBPACK_IMPORTED_MODULE_1__constants__["n" /* STRINGIFY_SELF_TYPES */].indexOf(type)) {
      return value;
    }

    if (~__WEBPACK_IMPORTED_MODULE_1__constants__["l" /* STRINGIFY_PREFIX_TYPES */].indexOf(type) || value === null) {
      return getValueForStringification(value);
    }

    if (~__WEBPACK_IMPORTED_MODULE_1__constants__["o" /* STRINGIFY_TOSTRING_TYPES */].indexOf(type)) {
      return value.toString();
    }

    objectClass = toString(value);

    if (~__WEBPACK_IMPORTED_MODULE_1__constants__["f" /* REPLACE_RECURSIVE_VALUE_CLASSES */].indexOf(objectClass)) {
      return getRecursiveStackValue(value, objectClass, stack, ++recursiveCounter);
    }

    if (objectClass === __WEBPACK_IMPORTED_MODULE_1__constants__["d" /* OBJECT_CLASS_TYPE_MAP */].ARGUMENTS) {
      return value;
    }

    if (~__WEBPACK_IMPORTED_MODULE_1__constants__["g" /* REPLACE_STRINGIFICATION_CLASSES */].indexOf(objectClass)) {
      return getValueForStringification(value);
    }

    return value;
  };
};

/**
 * @function getIntegerHashValue
 *
 * @description
 * based on string passed, get the integer hash value
 * through bitwise operation (based on spinoff of dbj2)
 *
 * @param {string} string the string to get the hash value for
 * @returns {number} the hash value
 */
var getIntegerHashValue = function getIntegerHashValue(string) {
  if (!string) {
    return 0;
  }

  var hashValue = 5381;

  for (var index = 0; index < string.length; index++) {
    hashValue = (hashValue << 5) + hashValue + string.charCodeAt(index);
  }

  return hashValue >>> 0;
};

/**
 * @function tryCatch
 *
 * @description
 * move try/catch to standalone function as any function that contains a try/catch
 * is not optimized (this allows optimization for as much as possible)
 *
 * @param {*} value the value to stringify
 * @returns {string} the stringified value
 */
var tryCatch = function tryCatch(value) {
  try {
    return JSON.stringify(value, createReplacer([]));
  } catch (exception) {
    return __WEBPACK_IMPORTED_MODULE_0_json_prune___default()(value);
  }
};

/**
 * @function getStringifiedValue
 *
 * @description
 * stringify the object passed leveraging JSON.stringify
 * with REPLACER, falling back to prune
 *
 * @param {*} object the object to stringify
 * @param {boolean} isCircular is the object circular or not
 * @returns {string} the stringified object
 */
var getStringifiedValue = function getStringifiedValue(object, isCircular) {
  var valueForStringification = getValueForStringification(object);

  if (typeof valueForStringification === 'string') {
    return valueForStringification;
  }

  return isCircular ? tryCatch(getValueForStringification(object)) : JSON.stringify(valueForStringification, createReplacer([]));
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// JSON.prune : a function to stringify any object without overflow
// two additional optional parameters :
//   - the maximal depth (default : 6)
//   - the maximal length of arrays (default : 50)
// You can also pass an "options" object.
// examples :
//   var json = JSON.prune(window)
//   var arr = Array.apply(0,Array(1000)); var json = JSON.prune(arr, 4, 20)
//   var json = JSON.prune(window.location, {inheritedProperties:true})
// Web site : http://dystroy.org/JSON.prune/
// JSON.prune on github : https://github.com/Canop/JSON.prune
// This was discussed here : http://stackoverflow.com/q/13861254/263525
// The code is based on Douglas Crockford's code : https://github.com/douglascrockford/JSON-js/blob/master/json2.js
// No effort was done to support old browsers. JSON.prune will fail on IE8.
(function () {
	'use strict';

	var DEFAULT_MAX_DEPTH = 6;
	var DEFAULT_ARRAY_MAX_LENGTH = 50;
	var DEFAULT_PRUNED_VALUE = '"-pruned-"';
	var seen; // Same variable used for all stringifications
	var iterator; // either forEachEnumerableOwnProperty, forEachEnumerableProperty or forEachProperty
	
	// iterates on enumerable own properties (default behavior)
	var forEachEnumerableOwnProperty = function(obj, callback) {
		for (var k in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, k)) callback(k);
		}
	};
	// iterates on enumerable properties
	var forEachEnumerableProperty = function(obj, callback) {
		for (var k in obj) callback(k);
	};
	// iterates on properties, even non enumerable and inherited ones
	// This is dangerous
	var forEachProperty = function(obj, callback, excluded) {
		if (obj==null) return;
		excluded = excluded || {};
		Object.getOwnPropertyNames(obj).forEach(function(k){
			if (!excluded[k]) {
				callback(k);
				excluded[k] = true;
			}
		});
		forEachProperty(Object.getPrototypeOf(obj), callback, excluded);
	};

	Object.defineProperty(Date.prototype, "toPrunedJSON", {value:Date.prototype.toJSON});

	var	cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		meta = {	// table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		};

	function quote(string) {
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string'
				? c
				: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}


	var prune = function (value, depthDecr, arrayMaxLength) {
		var prunedString = DEFAULT_PRUNED_VALUE;
		var replacer;
		if (typeof depthDecr == "object") {
			var options = depthDecr;
			depthDecr = options.depthDecr;
			arrayMaxLength = options.arrayMaxLength;
			iterator = options.iterator || forEachEnumerableOwnProperty;
			if (options.allProperties) iterator = forEachProperty;
			else if (options.inheritedProperties) iterator = forEachEnumerableProperty
			if ("prunedString" in options) {
				prunedString = options.prunedString;
			}
			if (options.replacer) {
				replacer = options.replacer;
			}
		} else {
			iterator = forEachEnumerableOwnProperty;
		}
		seen = [];
		depthDecr = depthDecr || DEFAULT_MAX_DEPTH;
		arrayMaxLength = arrayMaxLength || DEFAULT_ARRAY_MAX_LENGTH;
		function str(key, holder, depthDecr) {
			var i, k, v, length, partial, value = holder[key];

			if (value && typeof value === 'object' && typeof value.toPrunedJSON === 'function') {
				value = value.toPrunedJSON(key);
			}
			if (value && typeof value.toJSON === 'function') {
				value = value.toJSON(); 
			}

			switch (typeof value) {
			case 'string':
				return quote(value);
			case 'number':
				return isFinite(value) ? String(value) : 'null';
			case 'boolean':
			case 'null':
				return String(value);
			case 'object':
				if (!value) {
					return 'null';
				}
				if (depthDecr<=0 || seen.indexOf(value)!==-1) {
					if (replacer) {
						var replacement = replacer(value, prunedString, true);
						return replacement===undefined ? undefined : ''+replacement;
					}
					return prunedString;
				}
				seen.push(value);
				partial = [];
				if (Object.prototype.toString.apply(value) === '[object Array]') {
					length = Math.min(value.length, arrayMaxLength);
					for (i = 0; i < length; i += 1) {
						partial[i] = str(i, value, depthDecr-1) || 'null';
					}
					v = '[' + partial.join(',') + ']';
					if (replacer && value.length>arrayMaxLength) return replacer(value, v, false);
					return v;
				}
				iterator(value, function(k) {
					try {
						v = str(k, value, depthDecr-1);
						if (v) partial.push(quote(k) + ':' + v);
					} catch (e) { 
						// this try/catch due to forbidden accessors on some objects
					}				
				});
				return '{' + partial.join(',') + '}';
			case 'function':
			case 'undefined':
				return replacer ? replacer(value, undefined, false) : undefined;
			}
		}
		return str('', {'': value}, depthDecr);
	};
	
	prune.log = function() {
		console.log.apply(console, Array.prototype.map.call(arguments, function(v) {
			return JSON.parse(JSON.prune(v));
		}));
	};
	prune.forEachProperty = forEachProperty; // you might want to also assign it to Object.forEachProperty

	if (true) module.exports = prune;
	else JSON.prune = prune;
}());


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export OBJECT_CLASSES */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return OBJECT_CLASS_MAP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return OBJECT_CLASS_TYPE_MAP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return RECURSIVE_COUNTER_CUTOFF; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return REPLACE_RECURSIVE_VALUE_CLASSES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return REPLACE_STRINGIFICATION_CLASSES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return STRINGIFY_SELF_CLASSES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return STRINGIFY_PREFIX_CLASSES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return STRINGIFY_ITERABLE_CLASSES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return STRINGIFY_NOT_ENUMERABLE_CLASSES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return STRINGIFY_PREFIX_JOIN_CLASSES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return STRINGIFY_SELF_TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return STRINGIFY_PREFIX_TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return STRINGIFY_TOSTRING_TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HTML_ELEMENT_REGEXP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MATH_OBJECT; });
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * @constant {Array<string>} OBJECT_CLASSES
 */
var OBJECT_CLASSES = ['Arguments', 'Array', 'ArrayBuffer', 'Boolean', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array', 'Function', 'GeneratorFunction', 'HTMLElement', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Null', 'Object', 'Promise', 'RegExp', 'Set', 'String', 'Uint8Array', 'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'Undefined', 'WeakMap', 'WeakSet'];

/**
 * @constant {Object} OBJECT_CLASS_MAP
 */
var OBJECT_CLASS_MAP = OBJECT_CLASSES.reduce(function (objectClasses, type) {
  objectClasses['[object ' + type + ']'] = type;

  return objectClasses;
}, {});

/**
 * @constant {Object} OBJECT_CLASS_TYPE_MAP
 */
var OBJECT_CLASS_TYPE_MAP = OBJECT_CLASSES.reduce(function (objectClasses, type) {
  objectClasses[type.toUpperCase()] = '[object ' + type + ']';

  return objectClasses;
}, {});

/**
 * @constant {number} RECURSIVE_COUNTER_CUTOFF
 */
var RECURSIVE_COUNTER_CUTOFF = 512;

/**
 * @constant {Array<string>} REPLACE_RECURSIVE_VALUE_CLASSES
 */
var REPLACE_RECURSIVE_VALUE_CLASSES = [OBJECT_CLASS_TYPE_MAP.ARRAY, OBJECT_CLASS_TYPE_MAP.OBJECT];

/**
 * @constant {Array<string>} REPLACE_STRINGIFICATION_CLASSES
 */
var REPLACE_STRINGIFICATION_CLASSES = [OBJECT_CLASS_TYPE_MAP.DATE, OBJECT_CLASS_TYPE_MAP.MAP, OBJECT_CLASS_TYPE_MAP.SET, OBJECT_CLASS_TYPE_MAP.PROMISE, OBJECT_CLASS_TYPE_MAP.REGEXP, OBJECT_CLASS_TYPE_MAP.ERROR, OBJECT_CLASS_TYPE_MAP.GENERATORFUNCTION, OBJECT_CLASS_TYPE_MAP.WEAKMAP, OBJECT_CLASS_TYPE_MAP.WEAKSET, OBJECT_CLASS_TYPE_MAP.MATH, OBJECT_CLASS_TYPE_MAP.ARRAYBUFFER, OBJECT_CLASS_TYPE_MAP.DATAVIEW, OBJECT_CLASS_TYPE_MAP.FLOAT32ARRAY, OBJECT_CLASS_TYPE_MAP.FLOAT64ARRAY, OBJECT_CLASS_TYPE_MAP.INT8ARRAY, OBJECT_CLASS_TYPE_MAP.INT16ARRAY, OBJECT_CLASS_TYPE_MAP.INT32ARRAY, OBJECT_CLASS_TYPE_MAP.UINT8ARRAY, OBJECT_CLASS_TYPE_MAP.UINT8CLAMPEDARRAY, OBJECT_CLASS_TYPE_MAP.UINT16ARRAY, OBJECT_CLASS_TYPE_MAP.UINT32ARRAY];

/**
 * @constant {Array<string>} STRINGIFY_SELF_CLASSES
 */
var STRINGIFY_SELF_CLASSES = [OBJECT_CLASS_TYPE_MAP.ARRAY, OBJECT_CLASS_TYPE_MAP.OBJECT, OBJECT_CLASS_TYPE_MAP.ARGUMENTS];

/**
 * @constant {Array<string>} STRINGIFY_PREFIX_CLASSES
 */
var STRINGIFY_PREFIX_CLASSES = [OBJECT_CLASS_TYPE_MAP.ERROR, OBJECT_CLASS_TYPE_MAP.REGEXP];

/**
 * @constant {Array<string>} STRINGIFY_ITERABLE_CLASSES
 */
var STRINGIFY_ITERABLE_CLASSES = [OBJECT_CLASS_TYPE_MAP.MAP, OBJECT_CLASS_TYPE_MAP.SET];

/**
 * @constant {Array<string>} STRINGIFY_NOT_ENUMERABLE_CLASSES
 */
var STRINGIFY_NOT_ENUMERABLE_CLASSES = [OBJECT_CLASS_TYPE_MAP.PROMISE, OBJECT_CLASS_TYPE_MAP.WEAKMAP, OBJECT_CLASS_TYPE_MAP.WEAKSET];

/**
 * @constant {Array<string>} STRINGIFY_PREFIX_JOIN_CLASSES
 */
var STRINGIFY_PREFIX_JOIN_CLASSES = [OBJECT_CLASS_TYPE_MAP.FLOAT32ARRAY, OBJECT_CLASS_TYPE_MAP.FLOAT64ARRAY, OBJECT_CLASS_TYPE_MAP.INT8ARRAY, OBJECT_CLASS_TYPE_MAP.INT16ARRAY, OBJECT_CLASS_TYPE_MAP.INT32ARRAY, OBJECT_CLASS_TYPE_MAP.UINT8ARRAY, OBJECT_CLASS_TYPE_MAP.UINT8CLAMPEDARRAY, OBJECT_CLASS_TYPE_MAP.UINT16ARRAY, OBJECT_CLASS_TYPE_MAP.UINT32ARRAY];

/**
 * @constant {Array<string>} STRINGIFY_SELF_TYPES
 */
var STRINGIFY_SELF_TYPES = ['string', 'number'];

/**
 * @constant {Array<string>} STRINGIFY_PREFIX_TYPES
 */
var STRINGIFY_PREFIX_TYPES = ['boolean', 'undefined', 'function'];
/**
 * @constant {Array<string>} STRINGIFY_TOSTRING_TYPES
 */
var STRINGIFY_TOSTRING_TYPES = ['symbol'];

/**
 * @constant {RegExp} HTML_ELEMENT_REGEXP
 */
var HTML_ELEMENT_REGEXP = /\[object (HTML(.*)Element)\]/;

/**
 * @constant {Object} MATH_OBJECT
 */
var MATH_OBJECT = ['E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'PI', 'SQRT1_2', 'SQRT2'].reduce(function (mathObject, property) {
  var _extends2;

  return _extends({}, mathObject, (_extends2 = {}, _extends2[property] = Math[property], _extends2));
}, {});

/***/ })
/******/ ]);
});
//# sourceMappingURL=hash-it.js.map