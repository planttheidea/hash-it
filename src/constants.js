/**
 * @constant {string} CIRCULAR_VALUE
 */
export const CIRCULAR_VALUE = '~';

/**
 * @constant {Array<any>} EMPTY_VALUES
 */
export const EMPTY_VALUES = [void 0, null, '', [], {}]
  .concat(typeof Map === 'function' ? [new Map()] : [])
  .concat(typeof Set === 'function' ? [new Set()] : []);

/**
 * @constant {boolean} HAS_BUFFER_FROM_SUPPORT
 */
export const HAS_BUFFER_FROM_SUPPORT = typeof Buffer !== 'undefined' && typeof Buffer.from === 'function';

/**
 * @constant {boolean} HAS_UINT16ARRAY_SUPPORT
 */
export const HAS_UINT16ARRAY_SUPPORT = typeof Uint16Array === 'function';

/**
 * @constant {RegExp} HTML_ELEMENT_REGEXP
 */
export const HTML_ELEMENT_REGEXP = /\[object (HTML(.*)Element)\]/;

/**
 * @constant {RegExp} SVG_ELEMENT_REGEXP
 */
export const SVG_ELEMENT_REGEXP = /\[object (SVG(.*)Element)\]/;

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
  'DocumentFragment',
  'Error',
  'Event',
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
  'WeakSet',
  'Window'
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
export const OBJECT_CLASS_TYPE_MAP = Object.keys(OBJECT_CLASS_MAP).reduce((objectClassTypes, objectClass) => {
  objectClassTypes[OBJECT_CLASS_MAP[objectClass].toUpperCase()] = objectClass;

  return objectClassTypes;
}, {});

export const ITERABLE_TAGS = {
  '[object Map]': true,
  '[object Set]': true
};

export const PRIMITIVE_TAGS = {
  boolean: true,
  function: true,
  number: true,
  string: true,
  undefined: true
};

export const SELF_TAGS = {
  [OBJECT_CLASS_TYPE_MAP.ARGUMENTS]: true,
  [OBJECT_CLASS_TYPE_MAP.ARRAY]: true
};

export const TOSTRING_TAGS = {
  [OBJECT_CLASS_TYPE_MAP.REGEXP]: true,
  [OBJECT_CLASS_TYPE_MAP.SYMBOL]: true
};

export const TYPEDARRAY_TAGS = {
  [OBJECT_CLASS_TYPE_MAP.FLOAT32ARRAY]: true,
  [OBJECT_CLASS_TYPE_MAP.FLOAT64ARRAY]: true,
  [OBJECT_CLASS_TYPE_MAP.INT8ARRAY]: true,
  [OBJECT_CLASS_TYPE_MAP.INT16ARRAY]: true,
  [OBJECT_CLASS_TYPE_MAP.INT32ARRAY]: true,
  [OBJECT_CLASS_TYPE_MAP.UINT8ARRAY]: true,
  [OBJECT_CLASS_TYPE_MAP.UINT8CLAMPEDARRAY]: true,
  [OBJECT_CLASS_TYPE_MAP.UINT16ARRAY]: true,
  [OBJECT_CLASS_TYPE_MAP.UINT32ARRAY]: true
};

export const UNPARSEABLE_TAGS = {
  [OBJECT_CLASS_TYPE_MAP.GENERATOR]: true,
  [OBJECT_CLASS_TYPE_MAP.PROMISE]: true,
  [OBJECT_CLASS_TYPE_MAP.WEAKMAP]: true,
  [OBJECT_CLASS_TYPE_MAP.WEAKSET]: true
};
