export enum OBJECT_CLASS_TYPE {
  Arguments = '[object Arguments]',
  Array = '[object Array]',
  ArrayBuffer = '[object ArrayBuffer]',
  Boolean = '[object Boolean]',
  DataView = '[object DataView]',
  Date = '[object Date]',
  DocumentFragment = '[object DocumentFragment]',
  Error = '[object Error]',
  Event = '[object Event]',
  Float32Array = '[object Float32Array]',
  Float64Array = '[object Float64Array]',
  Function = '[object Function]',
  Generator = '[object Generator]',
  GeneratorFunction = '[object GeneratorFunction]',
  HTMLElement = '[object HTMLElement]',
  Int8Array = '[object Int8Array]',
  Int16Array = '[object Int16Array]',
  Int32Array = '[object Int32Array]',
  Map = '[object Map]',
  Null = '[object Null]',
  Number = '[object Number]',
  Object = '[object Object]',
  Promise = '[object Promise]',
  RegExp = '[object RegExp]',
  Set = '[object Set]',
  String = '[object String]',
  Symbol = '[object Symbol]',
  Uint8Array = '[object Uint8Array]',
  Uint8ClampedArray = '[object Uint8ClampedArray]',
  Uint16Array = '[object Uint16Array]',
  Uint32Array = '[object Uint32Array]',
  Undefined = '[object Undefined]',
  WeakMap = '[object WeakMap]',
  WeakSet = '[object WeakSet]',
  Window = '[object Window]',
}

export const OBJECT_CLASS = {
  [OBJECT_CLASS_TYPE.Arguments]: 'Arguments',
  [OBJECT_CLASS_TYPE.Array]: 'Array',
  [OBJECT_CLASS_TYPE.ArrayBuffer]: 'ArrayBuffer',
  [OBJECT_CLASS_TYPE.Boolean]: 'Boolean',
  [OBJECT_CLASS_TYPE.DataView]: 'DataView',
  [OBJECT_CLASS_TYPE.Date]: 'Date',
  [OBJECT_CLASS_TYPE.DocumentFragment]: 'DocumentFragment',
  [OBJECT_CLASS_TYPE.Error]: 'Error',
  [OBJECT_CLASS_TYPE.Event]: 'Event',
  [OBJECT_CLASS_TYPE.Float32Array]: 'Float32Array',
  [OBJECT_CLASS_TYPE.Float64Array]: 'Float64Array',
  [OBJECT_CLASS_TYPE.Function]: 'Function',
  [OBJECT_CLASS_TYPE.Generator]: 'Generator',
  [OBJECT_CLASS_TYPE.GeneratorFunction]: 'GeneratorFunction',
  [OBJECT_CLASS_TYPE.HTMLElement]: 'HTMLElement',
  [OBJECT_CLASS_TYPE.Int8Array]: 'Int8Array',
  [OBJECT_CLASS_TYPE.Int16Array]: 'Int16Array',
  [OBJECT_CLASS_TYPE.Int32Array]: 'Int32Array',
  [OBJECT_CLASS_TYPE.Map]: 'Map',
  [OBJECT_CLASS_TYPE.Null]: 'Null',
  [OBJECT_CLASS_TYPE.Number]: 'Number',
  [OBJECT_CLASS_TYPE.Object]: 'Object',
  [OBJECT_CLASS_TYPE.Promise]: 'Promise',
  [OBJECT_CLASS_TYPE.RegExp]: 'RegExp',
  [OBJECT_CLASS_TYPE.Set]: 'Set',
  [OBJECT_CLASS_TYPE.String]: 'String',
  [OBJECT_CLASS_TYPE.Symbol]: 'Symbol',
  [OBJECT_CLASS_TYPE.Uint8Array]: 'Uint8Array',
  [OBJECT_CLASS_TYPE.Uint8ClampedArray]: 'Uint8ClampedArray',
  [OBJECT_CLASS_TYPE.Uint16Array]: 'Uint16Array',
  [OBJECT_CLASS_TYPE.Uint32Array]: 'Uint32Array',
  [OBJECT_CLASS_TYPE.Undefined]: 'Undefined',
  [OBJECT_CLASS_TYPE.WeakMap]: 'WeakMap',
  [OBJECT_CLASS_TYPE.WeakSet]: 'WeakSet',
  [OBJECT_CLASS_TYPE.Window]: 'Window',
} as const;

export const BAILOUT_TAGS = {
  [OBJECT_CLASS_TYPE.Generator]: true,
  [OBJECT_CLASS_TYPE.Promise]: true,
  [OBJECT_CLASS_TYPE.WeakMap]: true,
  [OBJECT_CLASS_TYPE.WeakSet]: true,
} as const;

export const ITERABLE_TAGS = {
  [OBJECT_CLASS_TYPE.Map]: true,
  [OBJECT_CLASS_TYPE.Set]: true,
} as const;

export const PRIMITIVE_TAGS = {
  bigint: true,
  boolean: true,
  function: true,
  number: true,
  string: true,
  undefined: true,
} as const;

export const SELF_TAGS = {
  [OBJECT_CLASS_TYPE.Arguments]: true,
  [OBJECT_CLASS_TYPE.Array]: true,
} as const;

export const TO_STRING_TAGS = {
  [OBJECT_CLASS_TYPE.RegExp]: true,
  [OBJECT_CLASS_TYPE.Symbol]: true,
} as const;

export const TYPED_ARRAY_TAGS = {
  [OBJECT_CLASS_TYPE.Float32Array]: true,
  [OBJECT_CLASS_TYPE.Float64Array]: true,
  [OBJECT_CLASS_TYPE.Int8Array]: true,
  [OBJECT_CLASS_TYPE.Int16Array]: true,
  [OBJECT_CLASS_TYPE.Int32Array]: true,
  [OBJECT_CLASS_TYPE.Uint8Array]: true,
  [OBJECT_CLASS_TYPE.Uint8ClampedArray]: true,
  [OBJECT_CLASS_TYPE.Uint16Array]: true,
  [OBJECT_CLASS_TYPE.Uint32Array]: true,
} as const;
