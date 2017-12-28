/**
 * @constant {Array<string>} OBJECT_CLASSES
 */
export const OBJECT_CLASSES = [
  'Arguments',
  'Array',
  'ArrayBuffer',
  'Boolean',
  'DataView',
  'Date',
  'Error',
  'Float32Array',
  'Float64Array',
  'Function',
  'Generator',
  'GeneratorFunction',
  'HTMLElement',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'Map',
  'Math',
  'Null',
  'Number',
  'Object',
  'Promise',
  'RegExp',
  'Set',
  'String',
  'Symbol',
  'Uint8Array',
  'Uint8ClampedArray',
  'Uint16Array',
  'Uint32Array',
  'Undefined',
  'WeakMap',
  'WeakSet'
];

/**
 * @constant {Object} OBJECT_CLASS_MAP
 */
export const OBJECT_CLASS_MAP = OBJECT_CLASSES.reduce((objectClasses, type) => {
  objectClasses[`[object ${type}]`] = type;

  return objectClasses;
}, {});

/**
 * @constant {Object} OBJECT_CLASS_TYPE_MAP
 */
export const OBJECT_CLASS_TYPE_MAP = OBJECT_CLASSES.reduce((objectClasses, type) => {
  objectClasses[type.toUpperCase()] = `[object ${type}]`;

  return objectClasses;
}, {});

/**
 * @constant {number} RECURSIVE_COUNTER_CUTOFF
 */
export const RECURSIVE_COUNTER_CUTOFF = 512;

/**
 * @constant {Array<string>} REPLACE_RECURSIVE_VALUE_CLASSES
 */
export const REPLACE_RECURSIVE_VALUE_CLASSES = [OBJECT_CLASS_TYPE_MAP.ARRAY, OBJECT_CLASS_TYPE_MAP.OBJECT];

/**
 * @constant {Array<string>} REPLACE_STRINGIFICATION_CLASSES
 */
export const REPLACE_STRINGIFICATION_CLASSES = [
  OBJECT_CLASS_TYPE_MAP.DATE,
  OBJECT_CLASS_TYPE_MAP.MAP,
  OBJECT_CLASS_TYPE_MAP.SET,
  OBJECT_CLASS_TYPE_MAP.REGEXP,
  OBJECT_CLASS_TYPE_MAP.ERROR,
  OBJECT_CLASS_TYPE_MAP.GENERATORFUNCTION,
  OBJECT_CLASS_TYPE_MAP.MATH,
  OBJECT_CLASS_TYPE_MAP.ARRAYBUFFER,
  OBJECT_CLASS_TYPE_MAP.DATAVIEW,
  OBJECT_CLASS_TYPE_MAP.FLOAT32ARRAY,
  OBJECT_CLASS_TYPE_MAP.FLOAT64ARRAY,
  OBJECT_CLASS_TYPE_MAP.INT8ARRAY,
  OBJECT_CLASS_TYPE_MAP.INT16ARRAY,
  OBJECT_CLASS_TYPE_MAP.INT32ARRAY,
  OBJECT_CLASS_TYPE_MAP.UINT8ARRAY,
  OBJECT_CLASS_TYPE_MAP.UINT8CLAMPEDARRAY,
  OBJECT_CLASS_TYPE_MAP.UINT16ARRAY,
  OBJECT_CLASS_TYPE_MAP.UINT32ARRAY,
  OBJECT_CLASS_TYPE_MAP.PROMISE,
  OBJECT_CLASS_TYPE_MAP.GENERATOR,
  OBJECT_CLASS_TYPE_MAP.WEAKMAP,
  OBJECT_CLASS_TYPE_MAP.WEAKSET
];

/**
 * @constant {Array<string>} STRINGIFY_SELF_CLASSES
 */
export const STRINGIFY_SELF_CLASSES = [
  OBJECT_CLASS_TYPE_MAP.ARRAY,
  OBJECT_CLASS_TYPE_MAP.OBJECT,
  OBJECT_CLASS_TYPE_MAP.ARGUMENTS
];

/**
 * @constant {Array<string>} STRINGIFY_PREFIX_CLASSES
 */
export const STRINGIFY_PREFIX_CLASSES = [OBJECT_CLASS_TYPE_MAP.ERROR, OBJECT_CLASS_TYPE_MAP.REGEXP];

/**
 * @constant {Array<string>} STRINGIFY_ITERABLE_CLASSES
 */
export const STRINGIFY_ITERABLE_CLASSES = [OBJECT_CLASS_TYPE_MAP.MAP, OBJECT_CLASS_TYPE_MAP.SET];

/**
 * @constant {Array<string>} STRINGIFY_NOT_ENUMERABLE_CLASSES
 */
export const STRINGIFY_NOT_ENUMERABLE_CLASSES = [
  OBJECT_CLASS_TYPE_MAP.PROMISE,
  OBJECT_CLASS_TYPE_MAP.GENERATOR,
  OBJECT_CLASS_TYPE_MAP.WEAKMAP,
  OBJECT_CLASS_TYPE_MAP.WEAKSET
];

/**
 * @constant {Array<string>} STRINGIFY_PREFIX_JOIN_CLASSES
 */
export const STRINGIFY_PREFIX_JOIN_CLASSES = [
  OBJECT_CLASS_TYPE_MAP.FLOAT32ARRAY,
  OBJECT_CLASS_TYPE_MAP.FLOAT64ARRAY,
  OBJECT_CLASS_TYPE_MAP.INT8ARRAY,
  OBJECT_CLASS_TYPE_MAP.INT16ARRAY,
  OBJECT_CLASS_TYPE_MAP.INT32ARRAY,
  OBJECT_CLASS_TYPE_MAP.UINT8ARRAY,
  OBJECT_CLASS_TYPE_MAP.UINT8CLAMPEDARRAY,
  OBJECT_CLASS_TYPE_MAP.UINT16ARRAY,
  OBJECT_CLASS_TYPE_MAP.UINT32ARRAY
];

/**
 * @constant {Array<string>} STRINGIFY_SELF_TYPES
 */
export const STRINGIFY_SELF_TYPES = ['string', 'number'];

/**
 * @constant {Array<string>} STRINGIFY_PREFIX_TYPES
 */
export const STRINGIFY_PREFIX_TYPES = ['boolean', 'undefined', 'function', 'symbol'];

/**
 * @constant {Array<string>} STRINGIFY_TOSTRING_TYPES
 */
export const STRINGIFY_TOSTRING_TYPES = ['symbol', 'function'];

/**
 * @constant {Array<string>} STRINGIFY_TYPEOF_TYPES
 */
export const STRINGIFY_TYPEOF_TYPES = [...STRINGIFY_SELF_TYPES, ...STRINGIFY_PREFIX_TYPES];

/**
 * @constant {RegExp} HTML_ELEMENT_REGEXP
 */
export const HTML_ELEMENT_REGEXP = /\[object (HTML(.*)Element)\]/;

/**
 * @constant {Object} MATH_OBJECT
 */
export const MATH_OBJECT = ['E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'PI', 'SQRT1_2', 'SQRT2'].reduce(
  (mathObject, property) => {
    return {
      ...mathObject,
      [property]: Math[property]
    };
  },
  {}
);
