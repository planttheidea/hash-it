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
	    if (hashIt(arguments.length <= index - 1 ? undefined : arguments[index - 1]) !== hashIt(arguments.length <= index ? undefined : arguments[index])) {
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
	exports.getStringifiedValueWithRecursion = exports.getStringifiedValue = exports.tryCatch = exports.stringify = exports.getIntegerHashValue = exports.REPLACER = exports.getRecursiveStackValue = exports.getValueForStringification = exports.getStringifiedValueByObjectClass = exports.isNull = exports.prependTypeToString = exports.getIterablePairs = exports.getObjectType = exports.arrayBufferToString = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // external dependencies
	
	
	// constants
	
	
	// toString
	
	
	var _prune = __webpack_require__(3);
	
	var _prune2 = _interopRequireDefault(_prune);
	
	var _constants = __webpack_require__(5);
	
	var _toString = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * get the string value of the buffer passed
	 *
	 * @param {ArrayBuffer} buffer
	 * @returns {string}
	 */
	var arrayBufferToString = exports.arrayBufferToString = function arrayBufferToString(buffer) {
	  if ((typeof Uint16Array === 'undefined' ? 'undefined' : _typeof(Uint16Array)) === _constants.UNDEFINED_TYPEOF) {
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
	var getObjectType = exports.getObjectType = function getObjectType(type) {
	  return type.slice(8, -1);
	};
	
	/**
	 * get the key,value pairs for maps and sets
	 *
	 * @param {Map|Set} iterable
	 * @param {string} type
	 * @returns {Array<Array>}
	 */
	var getIterablePairs = exports.getIterablePairs = function getIterablePairs(iterable, type) {
	  var pairs = [getObjectType(type)];
	
	  iterable.forEach(function (item, key) {
	    pairs.push([key, item]);
	  });
	
	  return pairs;
	};
	
	/**
	 * prepend type to string value
	 *
	 * @param {string} string
	 * @param {string} type
	 * @returns {string}
	 */
	var prependTypeToString = exports.prependTypeToString = function prependTypeToString(string, type) {
	  return getObjectType(type) + ' ' + string;
	};
	
	/**
	 * is the object passed null
	 *
	 * @param {*} object
	 * @returns {boolean}
	 */
	var isNull = exports.isNull = function isNull(object) {
	  return object === null;
	};
	
	/**
	 * get the stringified value of the object based based on its toString class
	 *
	 * @param {*} object
	 * @returns {*}
	 */
	var getStringifiedValueByObjectClass = exports.getStringifiedValueByObjectClass = function getStringifiedValueByObjectClass(object) {
	  var type = (0, _toString.toString)(object);
	
	  if (type === _constants.ARRAY || type === _constants.OBJECT || type === _constants.ARGUMENTS) {
	    return object;
	  }
	
	  if (type === _constants.ERROR || type === _constants.REGEXP || isNull(object)) {
	    return prependTypeToString(object, type);
	  }
	
	  if (type === _constants.DATE) {
	    return prependTypeToString(object.valueOf(), type);
	  }
	
	  if (type === _constants.MAP || type === _constants.SET) {
	    return getIterablePairs(object, type);
	  }
	
	  if (type === _constants.PROMISE || type === _constants.WEAKMAP || type === _constants.WEAKSET) {
	    return prependTypeToString('NOT_ENUMERABLE', type);
	  }
	
	  if (type === _constants.ARRAY_BUFFER) {
	    return prependTypeToString(arrayBufferToString(object), type);
	  }
	
	  if (type === _constants.DATA_VIEW) {
	    return prependTypeToString(arrayBufferToString(object.buffer), type);
	  }
	
	  if (type === _constants.FLOAT_32_ARRAY || type === _constants.FLOAT_64_ARRAY || type === _constants.INT_8_ARRAY || type === _constants.INT_16_ARRAY || type === _constants.INT_32_ARRAY || type === _constants.UINT_8_ARRAY || type === _constants.UINT_8_CLAMPED_ARRAY || type === _constants.UINT_16_ARRAY || type === _constants.UINT_32_ARRAY) {
	    return prependTypeToString(object.join(','), type);
	  }
	
	  if (type === _constants.MATH) {
	    return _constants.MATH_OBJECT;
	  }
	
	  return _constants.HTML_ELEMENT_REGEXP.test(type) ? 'HTMLElement ' + object.textContent : object;
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
	var getValueForStringification = exports.getValueForStringification = function getValueForStringification(object) {
	  var type = typeof object === 'undefined' ? 'undefined' : _typeof(object);
	
	  if (type === _constants.STRING_TYPEOF || type === _constants.NUMBER_TYPEOF) {
	    return object;
	  }
	
	  if (type === _constants.BOOLEAN_TYPEOF || type === _constants.UNDEFINED_TYPEOF) {
	    return prependTypeToString(object, (0, _toString.toString)(object));
	  }
	
	  if (type === _constants.FUNCTION_TYPEOF) {
	    return (0, _toString.toFunctionString)(object, (0, _toString.toString)(object) === _constants.GENERATOR);
	  }
	
	  if (type === _constants.SYMBOL_TYPEOF) {
	    return object.toString();
	  }
	
	  return getStringifiedValueByObjectClass(object);
	};
	
	/**
	 * get the value either from the recursive storage stack
	 * or itself after being added to that stack
	 *
	 * @param {*} value
	 * @param {string} type
	 * @param {Array<*>} stack
	 * @param {number} index
	 * @param {number} recursiveCounter
	 * @returns {*}
	 */
	var getRecursiveStackValue = exports.getRecursiveStackValue = function getRecursiveStackValue(value, type, stack, index, recursiveCounter) {
	  if (!value) {
	    return prependTypeToString(value, type);
	  }
	
	  if (recursiveCounter > 255) {
	    return 'Undefined undefined';
	  }
	
	  index = stack.indexOf(value);
	
	  if (!~index) {
	    stack.push(value);
	
	    return value;
	  }
	
	  return '*Recursive-' + index;
	};
	
	/**
	 * create the replacer function leveraging closure for
	 * recursive stack storage
	 */
	var REPLACER = exports.REPLACER = function () {
	  var stack = void 0,
	      recursiveCounter = void 0,
	      index = void 0,
	      type = void 0;
	
	  return function (key, value) {
	    if (!key) {
	      stack = [value];
	      recursiveCounter = 0;
	
	      return value;
	    }
	
	    type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	
	    if (type === _constants.STRING_TYPEOF || type === _constants.NUMBER_TYPEOF || type === _constants.BOOLEAN_TYPEOF) {
	      return value;
	    }
	
	    if (type === _constants.UNDEFINED_TYPEOF || type === _constants.FUNCTION_TYPEOF) {
	      return getValueForStringification(value);
	    }
	
	    if (type === _constants.SYMBOL_TYPEOF) {
	      return value.toString();
	    }
	
	    type = (0, _toString.toString)(value);
	
	    if (type === _constants.ARRAY || type === _constants.OBJECT) {
	      return getRecursiveStackValue(value, type, stack, index, ++recursiveCounter);
	    }
	
	    if (type === _constants.ARGUMENTS) {
	      return value;
	    }
	
	    if (type === _constants.DATE || type === _constants.MAP || type === _constants.SET || type === _constants.PROMISE || type === _constants.REGEXP || isNull(value) || type === _constants.ERROR || type === _constants.GENERATOR || type === _constants.WEAKMAP || type === _constants.WEAKSET || type === _constants.MATH || type === _constants.ARRAY_BUFFER || type === _constants.DATA_VIEW || type === _constants.FLOAT_32_ARRAY || type === _constants.FLOAT_64_ARRAY || type === _constants.INT_8_ARRAY || type === _constants.INT_16_ARRAY || type === _constants.INT_32_ARRAY || type === _constants.UINT_8_ARRAY || type === _constants.UINT_8_CLAMPED_ARRAY || type === _constants.UINT_16_ARRAY || type === _constants.UINT_32_ARRAY) {
	      return getValueForStringification(value);
	    }
	
	    return value;
	  };
	}();
	
	/**
	 * based on string passed, get the integer hash value
	 * through bitwise operation (based on spinoff of dbj2)
	 *
	 * @param {string} string
	 * @returns {number}
	 */
	var getIntegerHashValue = exports.getIntegerHashValue = function getIntegerHashValue(string) {
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
	
	/**
	 * perform JSON.stringify on the value with the custom REPLACER
	 *
	 * @param {*} value
	 * @returns {string}
	 */
	var stringify = exports.stringify = function stringify(value) {
	  return JSON.stringify(value, REPLACER);
	};
	
	/**
	 * move try/catch to standalone function as any function that contains a try/catch
	 * is not optimized (this allows optimization for as much as possible)
	 * fac
	 * @param {*} value
	 * @returns {string}
	 */
	var tryCatch = exports.tryCatch = function tryCatch(value) {
	  try {
	    return stringify(value);
	  } catch (exception) {
	    return _prune2.default.prune(value);
	  }
	};
	
	/**
	 * stringify the object passed leveraging JSON.stringify
	 * with REPLACER, falling back to prune
	 *
	 * @param {*} object
	 * @returns {string}
	 */
	var getStringifiedValue = exports.getStringifiedValue = function getStringifiedValue(object) {
	  var valueForStringification = getValueForStringification(object);
	
	  if ((typeof valueForStringification === 'undefined' ? 'undefined' : _typeof(valueForStringification)) === _constants.STRING_TYPEOF) {
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
	var getStringifiedValueWithRecursion = exports.getStringifiedValueWithRecursion = function getStringifiedValueWithRecursion(object) {
	  var valueForStringification = getValueForStringification(object);
	
	  if ((typeof valueForStringification === 'undefined' ? 'undefined' : _typeof(valueForStringification)) === _constants.STRING_TYPEOF) {
	    return valueForStringification;
	  }
	
	  return tryCatch(getValueForStringification(object));
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	// constants
	
	
	var _toString = __webpack_require__(4);
	
	var _constants = __webpack_require__(5);
	
	/*
	  This is a heavily modified and reduced version of JSON.prune provided by Canop
	  at https://github.com/Canop/JSON.prune. All credit and praise should be directed
	  there.
	 */
	
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
	  _constants.ESCAPABLE.lastIndex = 0;
	
	  var c = void 0;
	
	  return !_constants.ESCAPABLE.test(string) ? '"' + string + '"' : '"' + string.replace(_constants.ESCAPABLE, function (a) {
	    c = _constants.META[a];
	
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
	        type = typeof value === 'undefined' ? 'undefined' : _typeof(value),
	        partial = [],
	        v = void 0;
	
	    if (type === _constants.STRING_TYPEOF) {
	      return quote(value);
	    }
	
	    if (type === _constants.BOOLEAN_TYPEOF || type === _constants.NUMBER_TYPEOF || type === _constants.UNDEFINED_TYPEOF) {
	      return '' + value;
	    }
	
	    if (type === _constants.FUNCTION_TYPEOF) {
	      return (0, _toString.toFunctionString)(value);
	    }
	
	    if (!value) {
	      return '' + value;
	    }
	
	    var index = seen.indexOf(value);
	
	    if (depthDecr <= 0 || !!~index) {
	      return _constants.DEFAULT_PRUNED_VALUE + '-' + index;
	    }
	
	    type = (0, _toString.toString)(value);
	
	    if (type === _toString.ARRAY) {
	      seen.push(value);
	
	      var length = Math.min(value.length, _constants.DEFAULT_ARRAY_MAX_LENGTH);
	
	      var _index = -1;
	
	      while (++_index < length) {
	        partial[_index] = pruneString(_index, value, depthDecr - 1);
	      }
	
	      v = '[' + partial.join(',') + ']';
	
	      return v;
	    }
	
	    if (type === _toString.DATE) {
	      return '' + value.valueOf();
	    }
	
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
	  };
	
	  return pruneString('', {
	    '': value
	  }, _constants.DEFAULT_MAX_DEPTH);
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
	var objectToString = Object.prototype.toString;
	
	/**
	 * create the fake function args array for the stringified function
	 *
	 * @param {number} length
	 * @returns {string}
	 */
	var getFunctionArgs = exports.getFunctionArgs = function getFunctionArgs(length) {
	  var string = '',
	      index = -1;
	
	  while (++index < length) {
	    string += 'arg,';
	  }
	
	  return string.slice(0, -1);
	};
	
	/**
	 * get the generic string value of the function passed
	 *
	 * @param {function} fn
	 * @param {boolean} isGenerator=false
	 * @returns {string}
	 */
	var toFunctionString = exports.toFunctionString = function toFunctionString(fn) {
	  var isGenerator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	  return 'function' + (isGenerator ? '*' : '') + ' ' + (fn.name || 'anonymous') + '(' + getFunctionArgs(fn.length) + '){}';
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

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var ARGUMENTS = exports.ARGUMENTS = '[object Arguments]';
	var ARRAY = exports.ARRAY = '[object Array]';
	var ARRAY_BUFFER = exports.ARRAY_BUFFER = '[object ArrayBuffer]';
	var DATA_VIEW = exports.DATA_VIEW = '[object DataView]';
	var DATE = exports.DATE = '[object Date]';
	var ERROR = exports.ERROR = '[object Error]';
	var FLOAT_32_ARRAY = exports.FLOAT_32_ARRAY = '[object Float32Array]';
	var FLOAT_64_ARRAY = exports.FLOAT_64_ARRAY = '[object Float64Array]';
	var GENERATOR = exports.GENERATOR = '[object GeneratorFunction]';
	var INT_8_ARRAY = exports.INT_8_ARRAY = '[object Int8Array]';
	var INT_16_ARRAY = exports.INT_16_ARRAY = '[object Int16Array]';
	var INT_32_ARRAY = exports.INT_32_ARRAY = '[object Int32Array]';
	var MAP = exports.MAP = '[object Map]';
	var MATH = exports.MATH = '[object Math]';
	var OBJECT = exports.OBJECT = '[object Object]';
	var PROMISE = exports.PROMISE = '[object Promise]';
	var REGEXP = exports.REGEXP = '[object RegExp]';
	var SET = exports.SET = '[object Set]';
	var STRING = exports.STRING = '[object String]';
	var UINT_8_ARRAY = exports.UINT_8_ARRAY = '[object Uint8Array]';
	var UINT_8_CLAMPED_ARRAY = exports.UINT_8_CLAMPED_ARRAY = '[object Uint8ClampedArray]';
	var UINT_16_ARRAY = exports.UINT_16_ARRAY = '[object Uint16Array]';
	var UINT_32_ARRAY = exports.UINT_32_ARRAY = '[object Uint32Array]';
	var WEAKMAP = exports.WEAKMAP = '[object WeakMap]';
	var WEAKSET = exports.WEAKSET = '[object WeakSet]';
	
	var BOOLEAN_TYPEOF = exports.BOOLEAN_TYPEOF = 'boolean';
	var FUNCTION_TYPEOF = exports.FUNCTION_TYPEOF = 'function';
	var NUMBER_TYPEOF = exports.NUMBER_TYPEOF = 'number';
	var STRING_TYPEOF = exports.STRING_TYPEOF = 'string';
	var SYMBOL_TYPEOF = exports.SYMBOL_TYPEOF = 'symbol';
	var UNDEFINED_TYPEOF = exports.UNDEFINED_TYPEOF = 'undefined';
	
	var DEFAULT_MAX_DEPTH = exports.DEFAULT_MAX_DEPTH = 6;
	var DEFAULT_ARRAY_MAX_LENGTH = exports.DEFAULT_ARRAY_MAX_LENGTH = 50;
	var DEFAULT_PRUNED_VALUE = exports.DEFAULT_PRUNED_VALUE = '*Recursive';
	var ESCAPABLE = exports.ESCAPABLE = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	var META = exports.META = { // table of character substitutions
	  '\b': '\\b',
	  '\t': '\\t',
	  '\n': '\\n',
	  '\f': '\\f',
	  '\r': '\\r',
	  '"': '\\"',
	  '\\': '\\\\'
	};
	
	var HTML_ELEMENT_REGEXP = exports.HTML_ELEMENT_REGEXP = /\[object (HTML(.*)Element)\]/;
	var MATH_OBJECT = exports.MATH_OBJECT = ['E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'PI', 'SQRT1_2', 'SQRT2'].reduce(function (mathObject, property) {
	  return _extends({}, mathObject, _defineProperty({}, property, Math[property]));
	}, {});

/***/ }
/******/ ])
});
;
//# sourceMappingURL=hash-it.js.map