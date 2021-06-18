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

const getFlags = <Tags extends readonly any[]>(tags: Tags): MappedFlag<Tags> =>
  tags.reduce((tag, item) => {
    tag[item as Tags[number]] = true;

    return tag;
  }, {} as MappedFlag<Tags>);

const OBJECT_CLASSES = [
  'Arguments',
  'Array',
  'ArrayBuffer',
  'BigInt',
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
  'Window',
] as const;

export const OBJECT_CLASS_TYPE = getClassTypes(OBJECT_CLASSES);

export const OBJECT_CLASS = getReversedClassTypes(OBJECT_CLASSES);

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

export const PRIMITIVE_TAGS = getFlags([
  'bigint',
  'boolean',
  'function',
  'number',
  'string',
  'undefined',
] as const);

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
