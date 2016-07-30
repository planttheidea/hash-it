var hashIt =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _utils = __webpack_require__(2);
	
	/**
	 * return the unique integer hash value for the object
	 *
	 * @param {any} object
	 * @returns {number}
	 */
	var hash = function hash(object) {
	  return (0, _utils.getIntegerHashValue)((0, _utils.stringify)(object));
	};
	
	/**
	 * determine if all objects passed are equal in value to one another
	 *
	 * @param {array<any>} objects
	 * @returns {boolean}
	 */
	hash.isEqual = function () {
	  var length = arguments.length;
	
	  if (length === 1) {
	    throw new Error('isEqual requires at least two objects to be passed for comparison.');
	  }
	
	  var index = 0;
	
	  while (++index < length) {
	    if (hash(arguments.length <= index - 1 + 0 ? undefined : arguments[index - 1 + 0]) !== hash(arguments.length <= index + 0 ? undefined : arguments[index + 0])) {
	      return false;
	    }
	  }
	
	  return true;
	};
	
	exports.default = hash;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.stringify = exports.replacer = exports.getIntegerHashValue = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _prune = __webpack_require__(3);
	
	var _prune2 = _interopRequireDefault(_prune);
	
	var _toString = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var HTML_ELEMENT_REGEXP = /\[object (HTML(.*)Element)\]/;
	var MATH_PROPERTIES = ['E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'PI', 'SQRT1_2', 'SQRT2'];
	
	/**
	 * get the string value of the buffer passed
	 * 
	 * @param {ArrayBuffer} buffer
	 * @returns {string}
	 */
	var arrayBufferToString = function arrayBufferToString(buffer) {
	  if (typeof Uint16Array === 'undefined') {
	    return '';
	  }
	
	  return String.fromCharCode.apply(null, new Uint16Array(buffer));
	};
	
	/**
	 * strip away [object and ] from return of toString()
	 * to get the object class
	 * 
	 * @param {string} type
	 * @returns {string}
	 */
	var getObjectType = function getObjectType(type) {
	  return type.replace(/^\[object (.+)\]$/, '$1');
	};
	
	/**
	 * prepend type to string value
	 * 
	 * @param {string} string
	 * @param {string} type
	 * @returns {string}
	 */
	var prependTypeToString = function prependTypeToString(string, type) {
	  return type + ' ' + string;
	};
	
	/**
	 * get the string value for the object used for stringification
	 *
	 * @param {any} object
	 * @returns {any}
	 */
	var getValueForStringification = function getValueForStringification(object) {
	  var toStringType = (0, _toString.toString)(object);
	  var type = getObjectType(toStringType);
	
	  var _ret = function () {
	    switch (toStringType) {
	      case _toString.types.ARRAY_BUFFER:
	        return {
	          v: prependTypeToString(arrayBufferToString(object), type)
	        };
	
	      case _toString.types.DATA_VIEW:
	        return {
	          v: prependTypeToString(arrayBufferToString(object.buffer), type)
	        };
	
	      case _toString.types.FLOAT_32_ARRAY:
	      case _toString.types.FLOAT_64_ARRAY:
	      case _toString.types.INT_8_ARRAY:
	      case _toString.types.INT_16_ARRAY:
	      case _toString.types.INT_32_ARRAY:
	      case _toString.types.UINT_8_ARRAY:
	      case _toString.types.UINT_8_CLAMPED_ARRAY:
	      case _toString.types.UINT_16_ARRAY:
	      case _toString.types.UINT_32_ARRAY:
	        return {
	          v: type + ' [' + object.join(',') + ']'
	        };
	
	      case _toString.types.DATE:
	        return {
	          v: prependTypeToString(object.valueOf(), type)
	        };
	
	      case _toString.types.FUNCTION:
	        return {
	          v: (0, _toString.toFunctionString)(object)
	        };
	
	      case _toString.types.GENERATOR:
	        return {
	          v: (0, _toString.toFunctionString)(object, true)
	        };
	
	      case _toString.types.ERROR:
	      case _toString.types.NULL:
	      case _toString.types.NUMBER:
	      case _toString.types.REGEXP:
	      case _toString.types.UNDEFINED:
	        return {
	          v: prependTypeToString(object, type)
	        };
	
	      case _toString.types.MAP:
	      case _toString.types.SET:
	        var pairs = [type];
	
	        object.forEach(function (item, key) {
	          pairs.push([key, item]);
	        });
	
	        return {
	          v: pairs
	        };
	
	      case _toString.types.OBJECT:
	        return {
	          v: !!object ? object : prependTypeToString(object, type)
	        };
	
	      case _toString.types.SYMBOL:
	        return {
	          v: object.toString()
	        };
	
	      case _toString.types.MATH:
	        var mathObject = {};
	
	        MATH_PROPERTIES.forEach(function (prop) {
	          mathObject[prop] = object[prop];
	        });
	
	        return {
	          v: mathObject
	        };
	
	      case _toString.types.PROMISE:
	      case _toString.types.WEAKMAP:
	      case _toString.types.WEAKSET:
	        return {
	          v: type + '--NOT_ENUMERABLE'
	        };
	
	      default:
	        return {
	          v: HTML_ELEMENT_REGEXP.test(toStringType) ? 'HTMLElement ' + object.textContent : object
	        };
	    }
	  }();
	
	  if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	};
	
	/**
	 * create the replacer function leveraging closure for
	 * recursive stack storage
	 */
	var REPLACER = function (stack, undefined, recursiveCounter, index) {
	  return function (key, value) {
	    if (key === '') {
	      stack = [value];
	      recursiveCounter = 0;
	
	      return value;
	    }
	
	    var type = (0, _toString.toString)(value);
	
	    switch (type) {
	      case _toString.types.ARRAY_BUFFER:
	      case _toString.types.DATA_VIEW:
	      case _toString.types.DATE:
	      case _toString.types.FLOAT_32_ARRAY:
	      case _toString.types.FLOAT_64_ARRAY:
	      case _toString.types.FUNCTION:
	      case _toString.types.GENERATOR:
	      case _toString.types.INT_8_ARRAY:
	      case _toString.types.INT_16_ARRAY:
	      case _toString.types.INT_32_ARRAY:
	      case _toString.types.ERROR:
	      case _toString.types.MAP:
	      case _toString.types.MATH:
	      case _toString.types.NULL:
	      case _toString.types.PROMISE:
	      case _toString.types.REGEXP:
	      case _toString.types.SET:
	      case _toString.types.SYMBOL:
	      case _toString.types.UINT_8_ARRAY:
	      case _toString.types.UINT_8_CLAMPED_ARRAY:
	      case _toString.types.UINT_16_ARRAY:
	      case _toString.types.UINT_32_ARRAY:
	      case _toString.types.UNDEFINED:
	      case _toString.types.WEAKMAP:
	      case _toString.types.WEAKSET:
	        return getValueForStringification(value);
	
	      case _toString.types.ARRAY:
	      case _toString.types.OBJECT:
	        if (!value) {
	          return prependTypeToString(value, type);
	        }
	
	        if (++recursiveCounter > 255) {
	          return 'Undefined undefined';
	        }
	
	        index = stack.indexOf(value);
	
	        if (!~index) {
	          stack.push(value);
	
	          return value;
	        }
	
	        return '*Recursive-' + index;
	
	      default:
	        return value;
	    }
	  };
	}();
	
	/**
	 * based on string passed, get the integer hash value
	 * through bitwise operation (based on spinoff of dbj2)
	 *
	 * @param {string} string
	 * @returns {number}
	 */
	var getIntegerHashValue = function getIntegerHashValue(string) {
	  if (!string) {
	    return 0;
	  }
	
	  var hashValue = 5381,
	      index = string.length;
	
	  while (index) {
	    hashValue = hashValue * 33 ^ string.charCodeAt(--index);
	  }
	
	  return hashValue >>> 0;
	};
	
	/**
	 * move try/catch to standalone function as any function that contains a try/catch
	 * is not optimized (this allows optimization for as much as possible)
	 * 
	 * @param {any} value
	 * @returns {string}
	 */
	var tryCatch = function tryCatch(value) {
	  try {
	    return JSON.stringify(value, REPLACER);
	  } catch (exception) {
	    return _prune2.default.prune(value);
	  }
	};
	
	/**
	 * stringify the object passed leveraging the REPLACER
	 *
	 * @param {any} object
	 * @returns {string}
	 */
	var stringify = function stringify(object) {
	  var value = getValueForStringification(object);
	
	  return tryCatch(value);
	};
	
	exports.getIntegerHashValue = getIntegerHashValue;
	exports.replacer = REPLACER;
	exports.stringify = stringify;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _toString = __webpack_require__(4);
	
	/*
	  This is a heavily modified and reduced version of JSON.prune provided by Canop
	  at https://github.com/Canop/JSON.prune. All credit and praise should be directed
	  there.
	 */
	
	var DEFAULT_MAX_DEPTH = 6;
	var DEFAULT_ARRAY_MAX_LENGTH = 50;
	var DEFAULT_PRUNED_VALUE = '*Recursive';
	var ESCAPABLE = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	var META = { // table of character substitutions
	  '\b': '\\b',
	  '\t': '\\t',
	  '\n': '\\n',
	  '\f': '\\f',
	  '\r': '\\r',
	  '"': '\\"',
	  '\\': '\\\\'
	};
	
	var seen = void 0;
	
	/**
	 * iterates on enumerable own properties (default behavior)
	 *
	 * @param {object} object
	 * @param {function} callback
	 */
	var forEachEnumerableOwnProperty = function forEachEnumerableOwnProperty(object, callback) {
	  for (var key in object) {
	    if (Object.prototype.hasOwnProperty.call(object, key)) {
	      callback(key);
	    }
	  }
	};
	
	/**
	 * return value surrounded by quotes, replacing escapable values
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	var quote = function quote(string) {
	  ESCAPABLE.lastIndex = 0;
	
	  var c = void 0;
	
	  return !ESCAPABLE.test(string) ? '"' + string + '"' : '"' + string.replace(ESCAPABLE, function (a) {
	    c = META[a];
	
	    return (0, _toString.toString)(c) === _toString.types.STRING ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	  }) + '"';
	};
	
	/**
	 * prune JSON for stringification
	 *
	 * @param {any} value
	 * @returns {string}
	 */
	var prune = function prune(value) {
	  seen = [];
	
	  var pruneString = function pruneString(key, holder, depthDecr) {
	    var value = holder[key],
	        partial = [],
	        v = void 0;
	
	    switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
	      case 'string':
	        return quote(value);
	
	      case 'boolean':
	      case 'null':
	      case 'number':
	      case 'undefined':
	        return '' + value;
	
	      case 'function':
	        return (0, _toString.toFunctionString)(value);
	
	      case 'object':
	        if (!value) {
	          return '' + value;
	        }
	
	        var index = seen.indexOf(value);
	
	        if (depthDecr <= 0 || !!~index) {
	          return DEFAULT_PRUNED_VALUE + '-' + index;
	        }
	
	        switch ((0, _toString.toString)(value)) {
	          case _toString.types.ARRAY:
	            seen.push(value);
	
	            var length = Math.min(value.length, DEFAULT_ARRAY_MAX_LENGTH);
	
	            var _index = -1;
	
	            while (++_index < length) {
	              partial[_index] = pruneString(_index, value, depthDecr - 1);
	            }
	
	            v = '[' + partial.join(',') + ']';
	
	            return v;
	
	          case _toString.types.DATE:
	            return '' + value.valueOf();
	
	          default:
	            seen.push(value);
	
	            forEachEnumerableOwnProperty(value, function (k) {
	              try {
	                v = pruneString(k, value, depthDecr - 1);
	
	                if (v) {
	                  partial.push(quote(k) + ':' + v);
	                }
	              } catch (exception) {
	                // this try/catch due to forbidden accessors on some objects
	              }
	            });
	
	            return '{' + partial.join(',') + '}';
	        }
	    }
	  };
	
	  return pruneString('', {
	    '': value
	  }, DEFAULT_MAX_DEPTH);
	};
	
	exports.default = {
	  prune: prune
	};
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var ARRAY = '[object Array]';
	var ARRAY_BUFFER = '[object ArrayBuffer]';
	var BOOLEAN = '[object Boolean]';
	var DATA_VIEW = '[object DataView]';
	var DATE = '[object Date]';
	var ERROR = '[object Error]';
	var FLOAT_32_ARRAY = '[object Float32Array]';
	var FLOAT_64_ARRAY = '[object Float64Array]';
	var FUNCTION = '[object Function]';
	var GENERATOR = '[object GeneratorFunction]';
	var INT_8_ARRAY = '[object Int8Array]';
	var INT_16_ARRAY = '[object Int16Array]';
	var INT_32_ARRAY = '[object Int32Array]';
	var MAP = '[object Map]';
	var MATH = '[object Math]';
	var NULL = '[object Null]';
	var NUMBER = '[object Number]';
	var OBJECT = '[object Object]';
	var PROMISE = '[object Promise]';
	var REGEXP = '[object RegExp]';
	var SET = '[object Set]';
	var STRING = '[object String]';
	var SYMBOL = '[object Symbol]';
	var UINT_8_ARRAY = '[object Uint8Array]';
	var UINT_8_CLAMPED_ARRAY = '[object Uint8ClampedArray]';
	var UINT_16_ARRAY = '[object Uint16Array]';
	var UINT_32_ARRAY = '[object Uint32Array]';
	var UNDEFINED = '[object Undefined]';
	var WEAKMAP = '[object WeakMap]';
	var WEAKSET = '[object WeakSet]';
	var WINDOW = '[object Window]';
	
	var TYPES = {
	  ARRAY: ARRAY,
	  ARRAY_BUFFER: ARRAY_BUFFER,
	  BOOLEAN: BOOLEAN,
	  DATA_VIEW: DATA_VIEW,
	  DATE: DATE,
	  ERROR: ERROR,
	  FLOAT_32_ARRAY: FLOAT_32_ARRAY,
	  FLOAT_64_ARRAY: FLOAT_64_ARRAY,
	  FUNCTION: FUNCTION,
	  GENERATOR: GENERATOR,
	  INT_8_ARRAY: INT_8_ARRAY,
	  INT_16_ARRAY: INT_16_ARRAY,
	  INT_32_ARRAY: INT_32_ARRAY,
	  MAP: MAP,
	  MATH: MATH,
	  NULL: NULL,
	  NUMBER: NUMBER,
	  OBJECT: OBJECT,
	  PROMISE: PROMISE,
	  REGEXP: REGEXP,
	  SET: SET,
	  STRING: STRING,
	  SYMBOL: SYMBOL,
	  UINT_8_ARRAY: UINT_8_ARRAY,
	  UINT_8_CLAMPED_ARRAY: UINT_8_CLAMPED_ARRAY,
	  UINT_16_ARRAY: UINT_16_ARRAY,
	  UINT_32_ARRAY: UINT_32_ARRAY,
	  UNDEFINED: UNDEFINED,
	  WEAKMAP: WEAKMAP,
	  WEAKSET: WEAKSET,
	  WINDOW: WINDOW
	};
	
	/**
	 * get the generic string value of the function passed
	 *
	 * @param {function} fn
	 * @param {boolean} isGenerator=false
	 * @returns {string}
	 */
	var toFunctionString = function toFunctionString(fn) {
	  var isGenerator = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	  return 'function' + (isGenerator ? '*' : '') + ' ' + (fn.name || 'anonymous') + '(' + new Array(fn.length + 1).join(',arg').slice(1) + '){}';
	};
	
	/**
	 * get the toString value of object
	 *
	 * @param {any} object
	 * @returns {string}
	 */
	var toString = function toString(object) {
	  return Object.prototype.toString.call(object);
	};
	
	exports.toFunctionString = toFunctionString;
	exports.toString = toString;
	exports.types = TYPES;

/***/ }
/******/ ]);
//# sourceMappingURL=hash-it.js.map