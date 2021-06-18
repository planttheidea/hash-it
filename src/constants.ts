type ElementOf<T> = T extends (infer E)[]
  ? E
  : T extends readonly (infer E)[]
  ? E
  : never;

type MappedFlag<Type extends readonly any[]> = {
  [Key in ElementOf<Type>]: true;
};

type MappedClass<Type extends readonly any[]> = {
  [Key in ElementOf<Type>]: `[object ${Key}]`;
};

type MappedReverseClass<Type extends readonly any[]> = {
  [Key in ElementOf<Type> as `[object ${Key}]`]: Key;
};

const getClassTypes = <Classes extends readonly any[]>(
  classes: Classes,
): MappedClass<Classes> =>
  classes.reduce((map, className: Classes[number]) => {
    map[className] = `[object ${className}]`;

    return map;
  }, {} as MappedClass<Classes>);

const getReversedClassTypes = <Classes extends readonly any[]>(
  classes: Classes,
): MappedReverseClass<Classes> =>
  classes.reduce((map, className: Classes[number]) => {
    map[`[object ${className}]` as const] = className;

    return map;
  }, {} as MappedReverseClass<Classes>);

const getFlags = <Flags extends readonly any[]>(
  flags: Flags,
): MappedFlag<Flags> =>
  flags.reduce((flag, item: Flags[number]) => {
    flag[item] = true;

    return flag;
  }, {} as MappedFlag<Flags>);

const OBJECT_CLASSES = [
  // self tags
  'Array',
  'Arguments',

  'Object',

  // toString tags
  'RegExp',
  'Symbol',

  // iterable tags
  'Map',
  'Set',

  'Date',

  'Error',

  'Event',

  // bailout tags
  'Generator',
  'Promise',
  'WeakMap',
  'WeakSet',

  'DocumentFragment',

  // typed array tags
  'Float32Array',
  'Float64Array',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Uint16Array',
  'Uint32Array',

  'ArrayBuffer',

  'DataView',

  'DocumentFragment',

  'Window',

  // primitive classes, e.g. new String()
  'String',
  'Number',
  'Boolean',
  'Function',
  'Undefined',
  'GeneratorFunction',
  'BigInt',
  'Null',
] as const;

export const OBJECT_CLASS_TYPE = getClassTypes(OBJECT_CLASSES);

export const OBJECT_CLASS = getReversedClassTypes(OBJECT_CLASSES);

export const BAILOUT_TAGS = getFlags([
  OBJECT_CLASS_TYPE.Generator,
  OBJECT_CLASS_TYPE.Promise,
  OBJECT_CLASS_TYPE.WeakMap,
  OBJECT_CLASS_TYPE.WeakSet,
]);

export const NORMALIZED_TAGS = getFlags([
  OBJECT_CLASS_TYPE.Date,
  OBJECT_CLASS_TYPE.RegExp,
]);

export const ITERABLE_TAGS = getFlags([
  OBJECT_CLASS_TYPE.Map,
  OBJECT_CLASS_TYPE.Set,
]);

export const SELF_TAGS = getFlags([
  OBJECT_CLASS_TYPE.Arguments,
  OBJECT_CLASS_TYPE.Array,
]);

export const TO_STRING_TAGS = getFlags([
  OBJECT_CLASS_TYPE.RegExp,
  OBJECT_CLASS_TYPE.Symbol,
]);

export const TYPED_ARRAY_TAGS = getFlags([
  OBJECT_CLASS_TYPE.Float32Array,
  OBJECT_CLASS_TYPE.Float64Array,
  OBJECT_CLASS_TYPE.Int8Array,
  OBJECT_CLASS_TYPE.Int16Array,
  OBJECT_CLASS_TYPE.Int32Array,
  OBJECT_CLASS_TYPE.Uint8Array,
  OBJECT_CLASS_TYPE.Uint8ClampedArray,
  OBJECT_CLASS_TYPE.Uint16Array,
  OBJECT_CLASS_TYPE.Uint32Array,
]);
