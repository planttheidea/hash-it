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

const getClassTypes = <
  Classes extends readonly any[],
  Reversed extends boolean,
>(
  classes: Classes,
  reversed: Reversed,
): Reversed extends true ? MappedReverseClass<Classes> : MappedClass<Classes> =>
  classes.reduce((map, className: Classes[number]) => {
    const toStringClassName = `[object ${className}]`;

    if (reversed) {
      map[toStringClassName] = className;
    } else {
      map[className] = toStringClassName;
    }

    return map;
  }, {});

const getFlags = <Flags extends readonly any[]>(
  flags: Flags,
): MappedFlag<Flags> =>
  flags.reduce((flag, item: Flags[number]) => {
    flag[item] = true;

    return flag;
  }, {});

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

export const OBJECT_CLASS_TYPE = getClassTypes(OBJECT_CLASSES, false);
export const OBJECT_CLASS = getClassTypes(OBJECT_CLASSES, true);

export const BAILOUT_TAGS = getFlags([
  OBJECT_CLASS_TYPE.Generator,
  OBJECT_CLASS_TYPE.Promise,
  OBJECT_CLASS_TYPE.WeakMap,
  OBJECT_CLASS_TYPE.WeakSet,
]);

export const ITERABLE_TAGS = getFlags([
  OBJECT_CLASS_TYPE.Map,
  OBJECT_CLASS_TYPE.Set,
]);

export const NORMALIZED_TAGS = getFlags([
  OBJECT_CLASS_TYPE.Date,
  OBJECT_CLASS_TYPE.RegExp,
]);

export const PRIMITIVE_TAGS = getFlags([
  'bigint',
  'boolean',
  'function',
  'number',
  'string',
  'undefined',
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
