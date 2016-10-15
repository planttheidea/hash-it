(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("hashIt", [], factory);
	else if(typeof exports === 'object')
		exports["hashIt"] = factory();
	else
		root["hashIt"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utils = __webpack_require__(2);
	
	/**
	 * return the unique integer hash value for the object
	 *
	 * @param {*} object
	 * @returns {number}
	 */
	var hashIt = function hashIt(object) {
	  var stringifiedValue = (0, _utils.getStringifiedValue)(object);
	
	  return (0, _utils.getIntegerHashValue)(stringifiedValue);
	};
	
	var UNDEFINED_HASH = hashIt(undefined);
	var NULL_HASH = hashIt(null);
	var EMPTY_ARRAY_HASH = hashIt([]);
	var EMPTY_MAP_HASH = hashIt(new Map());
	var EMPTY_NUMBER_HASH = hashIt(0);
	var EMPTY_OBJECT_HASH = hashIt({});
	var EMPTY_SET_HASH = hashIt(new Set());
	var EMPTY_STRING_HASH = hashIt('');
	
	/**
	 * determine if all objects passed are equal in value to one another
	 *
	 * @param {array<*>} objects
	 * @returns {boolean}
	 */
	hashIt.isEqual = function () {
	  var length = arguments.length;
	
	  if (length === 1) {
	    throw new Error('isEqual requires at least two objects to be passed for comparison.');
	  }
	
	  var index = 0;
	
	  while (++index < length) {
	    if (hashIt(arguments.length <= index - 1 + 0 ? undefined : arguments[index - 1 + 0]) !== hashIt(arguments.length <= index + 0 ? undefined : arguments[index + 0])) {
	      return false;
	    }
	  }
	
	  return true;
	};
	
	/**
	 * determine if object is empty, meaning it is an array / object / map / set with values populated,
	 * or is a string with no length, or is undefined or null
	 *
	 * @param {*} object
	 * @returns {boolean}
	 */
	hashIt.isEmpty = function (object) {
	  var objectHash = hashIt(object);
	
	  return objectHash === UNDEFINED_HASH || objectHash === NULL_HASH || objectHash === EMPTY_ARRAY_HASH || objectHash === EMPTY_MAP_HASH || objectHash === EMPTY_NUMBER_HASH || objectHash === EMPTY_OBJECT_HASH || objectHash === EMPTY_SET_HASH || objectHash === EMPTY_STRING_HASH;
	};
	
	/**
	 * determine if object is null
	 *
	 * @param {*} object
	 * @returns {boolean}
	 */
	hashIt.isNull = function (object) {
	  return hashIt(object) === NULL_HASH;
	};
	
	/**
	 * determine if object is undefined
	 *
	 * @param {*} object
	 * @returns {boolean}
	 */
	hashIt.isUndefined = function (object) {
	  return hashIt(object) === UNDEFINED_HASH;
	};
	
	/**
	 * return the unique integer hash value for the object
	 *
	 * @param {*} object
	 * @returns {number}
	 */
	hashIt.withRecursion = function (object) {
	  var stringifiedValue = (0, _utils.getStringifiedValueWithRecursion)(object);
	
	  return (0, _utils.getIntegerHashValue)(stringifiedValue);
	};
	
	exports.default = hashIt;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.replacer = exports.getStringifiedValueWithRecursion = exports.getStringifiedValue = exports.getIntegerHashValue = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _prune = __webpack_require__(3);
	
	var _prune2 = _interopRequireDefault(_prune);
	
	var _toString = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var HTML_ELEMENT_REGEXP = /\[object (HTML(.*)Element)\]/;
	var MATH_OBJECT = ['E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'PI', 'SQRT1_2', 'SQRT2'].reduce(function (mathObject, property) {
	  return _extends({}, mathObject, _defineProperty({}, property, Math[property]));
	}, {});
	
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
	 * get the key,value pairs for maps and sets
	 *
	 * @param {Map|Set} iterable
	 * @param {string} type
	 * @returns {Array<Array>}
	 */
	var getIterablePairs = function getIterablePairs(iterable, type) {
	  var pairs = [getObjectType(type)];
	
	  iterable.forEach(function (item, key) {
	    pairs.push([key, item]);
	  });
	
	  return pairs;
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
	  return getObjectType(type) + ' ' + string;
	};
	
	/**
	 * get the string value for the object used for stringification
	 *
	 * @param {*} object
	 * @param {ArrayBuffer} [object.buffer]
	 * @param {function} [object.forEach]
	 * @param {function} [object.join]
	 * @param {string} [object.textContent]
	 * @returns {*}
	 */
	var getValueForStringification = function getValueForStringification(object) {
	  var type = (0, _toString.toString)(object);
	
	  switch (typeof object === 'undefined' ? 'undefined' : _typeof(object)) {
	    case _toString.STRING_TYPEOF:
	    case _toString.NUMBER_TYPEOF:
	      return object;
	
	    case _toString.BOOLEAN_TYPEOF:
	    case _toString.UNDEFINED_TYPEOF:
	      return prependTypeToString(object, type);
	
	    case _toString.FUNCTION_TYPEOF:
	      return (0, _toString.toFunctionString)(object, type === _toString.GENERATOR);
	
	    default:
	      switch (type) {
	        case _toString.ARRAY:
	        case _toString.OBJECT:
	        case _toString.ARGUMENTS:
	          return object;
	
	        case _toString.ERROR:
	        case _toString.NULL:
	        case _toString.REGEXP:
	          return prependTypeToString(object, type);
	
	        case _toString.DATE:
	          return prependTypeToString(object.valueOf(), type);
	
	        case _toString.SYMBOL:
	          return object.toString();
	
	        case _toString.PROMISE:
	        case _toString.WEAKMAP:
	        case _toString.WEAKSET:
	          return prependTypeToString('NOT_ENUMERABLE', type);
	
	        case _toString.MAP:
	        case _toString.SET:
	          return getIterablePairs(object, type);
	
	        case _toString.ARRAY_BUFFER:
	          return prependTypeToString(arrayBufferToString(object), type);
	
	        case _toString.DATA_VIEW:
	          return prependTypeToString(arrayBufferToString(object.buffer), type);
	
	        case _toString.FLOAT_32_ARRAY:
	        case _toString.FLOAT_64_ARRAY:
	        case _toString.INT_8_ARRAY:
	        case _toString.INT_16_ARRAY:
	        case _toString.INT_32_ARRAY:
	        case _toString.UINT_8_ARRAY:
	        case _toString.UINT_8_CLAMPED_ARRAY:
	        case _toString.UINT_16_ARRAY:
	        case _toString.UINT_32_ARRAY:
	          return prependTypeToString(object.join(','), type);
	
	        case _toString.MATH:
	          return MATH_OBJECT;
	
	        default:
	          return HTML_ELEMENT_REGEXP.test(type) ? 'HTMLElement ' + object.textContent : object;
	      }
	  }
	};
	
	/**
	 * create the replacer function leveraging closure for
	 * recursive stack storage
	 */
	var REPLACER = function (stack, undefined, recursiveCounter, index) {
	  return function (key, value) {
	    if (!key) {
	      stack = [value];
	      recursiveCounter = 0;
	
	      return value;
	    }
	
	    var type = (0, _toString.toString)(value);
	
	    switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
	      case _toString.STRING_TYPEOF:
	      case _toString.NUMBER_TYPEOF:
	      case _toString.BOOLEAN_TYPEOF:
	        return value;
	
	      case _toString.UNDEFINED_TYPEOF:
	      case _toString.FUNCTION_TYPEOF:
	        return getValueForStringification(value);
	
	      default:
	        switch (type) {
	          case _toString.ARRAY:
	          case _toString.OBJECT:
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
	
	          case _toString.ARGUMENTS:
	            return value;
	
	          case _toString.DATE:
	          case _toString.FUNCTION:
	          case _toString.MAP:
	          case _toString.SET:
	          case _toString.PROMISE:
	          case _toString.REGEXP:
	          case _toString.NULL:
	          case _toString.ARRAY_BUFFER:
	          case _toString.DATA_VIEW:
	          case _toString.FLOAT_32_ARRAY:
	          case _toString.FLOAT_64_ARRAY:
	          case _toString.GENERATOR:
	          case _toString.INT_8_ARRAY:
	          case _toString.INT_16_ARRAY:
	          case _toString.INT_32_ARRAY:
	          case _toString.ERROR:
	          case _toString.MATH:
	          case _toString.SYMBOL:
	          case _toString.UINT_8_ARRAY:
	          case _toString.UINT_8_CLAMPED_ARRAY:
	          case _toString.UINT_16_ARRAY:
	          case _toString.UINT_32_ARRAY:
	          case _toString.UNDEFINED:
	          case _toString.WEAKMAP:
	          case _toString.WEAKSET:
	            return getValueForStringification(value);
	
	          default:
	            return value;
	        }
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
	
	  var length = string.length;
	
	  var hashValue = 5381,
	      index = -1;
	
	  while (++index < length) {
	    hashValue = (hashValue << 5) + hashValue + string.charCodeAt(index);
	  }
	
	  return hashValue >>> 0;
	};
	
	var stringify = function stringify(value) {
	  return JSON.stringify(value, REPLACER);
	};
	
	var prune = function prune(value) {
	  return _prune2.default.prune(value);
	};
	
	/**
	 * move try/catch to standalone function as any function that contains a try/catch
	 * is not optimized (this allows optimization for as much as possible)
	 * fac
	 * @param {*} value
	 * @returns {string}
	 */
	var tryCatch = function tryCatch(value) {
	  try {
	    return stringify(value, REPLACER);
	  } catch (exception) {
	    return prune(value);
	  }
	};
	
	/**
	 * stringify the object passed leveraging JSON.stringify
	 * with REPLACER, falling back to prune
	 *
	 * @param {*} object
	 * @returns {string}
	 */
	var getStringifiedValue = function getStringifiedValue(object) {
	  var valueForStringification = getValueForStringification(object);
	
	  if (typeof valueForStringification === 'string') {
	    return valueForStringification;
	  }
	
	  return stringify(valueForStringification);
	};
	
	/**
	 * stringify the object passed leveraging JSON.stringify
	 * with REPLACER
	 *
	 * @param {*} object
	 * @returns {string}
	 */
	var getStringifiedValueWithRecursion = function getStringifiedValueWithRecursion(object) {
	  var valueForStringification = getValueForStringification(object);
	
	  if (typeof valueForStringification === 'string') {
	    return valueForStringification;
	  }
	
	  return tryCatch(getValueForStringification(object));
	};
	
	exports.getIntegerHashValue = getIntegerHashValue;
	exports.getStringifiedValue = getStringifiedValue;
	exports.getStringifiedValueWithRecursion = getStringifiedValueWithRecursion;
	exports.replacer = REPLACER;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
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
	
	    return (0, _toString.toString)(c) === _toString.STRING ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	  }) + '"';
	};
	
	/**
	 * prune JSON for stringification
	 *
	 * @param {*} value
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
	          case _toString.ARRAY:
	            seen.push(value);
	
	            var length = Math.min(value.length, DEFAULT_ARRAY_MAX_LENGTH);
	
	            var _index = -1;
	
	            while (++_index < length) {
	              partial[_index] = pruneString(_index, value, depthDecr - 1);
	            }
	
	            v = '[' + partial.join(',') + ']';
	
	            return v;
	
	          case _toString.DATE:
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
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ARGUMENTS = exports.ARGUMENTS = '[object Arguments]';
	var ARRAY = exports.ARRAY = '[object Array]';
	var ARRAY_BUFFER = exports.ARRAY_BUFFER = '[object ArrayBuffer]';
	var BOOLEAN = exports.BOOLEAN = '[object Boolean]';
	var DATA_VIEW = exports.DATA_VIEW = '[object DataView]';
	var DATE = exports.DATE = '[object Date]';
	var ERROR = exports.ERROR = '[object Error]';
	var FLOAT_32_ARRAY = exports.FLOAT_32_ARRAY = '[object Float32Array]';
	var FLOAT_64_ARRAY = exports.FLOAT_64_ARRAY = '[object Float64Array]';
	var FUNCTION = exports.FUNCTION = '[object Function]';
	var GENERATOR = exports.GENERATOR = '[object GeneratorFunction]';
	var INT_8_ARRAY = exports.INT_8_ARRAY = '[object Int8Array]';
	var INT_16_ARRAY = exports.INT_16_ARRAY = '[object Int16Array]';
	var INT_32_ARRAY = exports.INT_32_ARRAY = '[object Int32Array]';
	var MAP = exports.MAP = '[object Map]';
	var MATH = exports.MATH = '[object Math]';
	var NULL = exports.NULL = '[object Null]';
	var NUMBER = exports.NUMBER = '[object Number]';
	var OBJECT = exports.OBJECT = '[object Object]';
	var PROMISE = exports.PROMISE = '[object Promise]';
	var REGEXP = exports.REGEXP = '[object RegExp]';
	var SET = exports.SET = '[object Set]';
	var STRING = exports.STRING = '[object String]';
	var SYMBOL = exports.SYMBOL = '[object Symbol]';
	var UINT_8_ARRAY = exports.UINT_8_ARRAY = '[object Uint8Array]';
	var UINT_8_CLAMPED_ARRAY = exports.UINT_8_CLAMPED_ARRAY = '[object Uint8ClampedArray]';
	var UINT_16_ARRAY = exports.UINT_16_ARRAY = '[object Uint16Array]';
	var UINT_32_ARRAY = exports.UINT_32_ARRAY = '[object Uint32Array]';
	var UNDEFINED = exports.UNDEFINED = '[object Undefined]';
	var WEAKMAP = exports.WEAKMAP = '[object WeakMap]';
	var WEAKSET = exports.WEAKSET = '[object WeakSet]';
	
	var BOOLEAN_TYPEOF = exports.BOOLEAN_TYPEOF = 'boolean';
	var FUNCTION_TYPEOF = exports.FUNCTION_TYPEOF = 'function';
	var NUMBER_TYPEOF = exports.NUMBER_TYPEOF = 'number';
	var STRING_TYPEOF = exports.STRING_TYPEOF = 'string';
	var UNDEFINED_TYPEOF = exports.UNDEFINED_TYPEOF = 'undefined';
	
	var objectToString = Object.prototype.toString;
	
	/**
	 * get the generic string value of the function passed
	 *
	 * @param {function} fn
	 * @param {boolean} isGenerator=false
	 * @returns {string}
	 */
	var toFunctionString = exports.toFunctionString = function toFunctionString(fn) {
	  var isGenerator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	  return 'function' + (isGenerator ? '*' : '') + ' ' + (fn.name || 'anonymous') + '(' + new Array(fn.length + 1).join(',arg').slice(1) + '){}';
	};
	
	/**
	 * get the toString value of object
	 *
	 * @param {*} object
	 * @returns {string}
	 */
	var toString = exports.toString = function toString(object) {
	  return objectToString.call(object);
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=hash-it.js.map