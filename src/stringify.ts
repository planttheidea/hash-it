import { sort, sortByKey, sortBySelf } from './sort';

interface RecursiveState {
  cache: WeakMap<any, number>;
  id: number;
}

const CLASSES = {
  '[object Arguments]': 0,
  '[object Array]': 1,
  '[object ArrayBuffer]': 2,
  '[object BigInt]': 3,
  '[object Boolean]': 4,
  '[object DataView]': 5,
  '[object Date]': 6,
  '[object DocumentFragment]': 7,
  '[object Error]': 8,
  '[object Event]': 9,
  '[object Float32Array]': 10,
  '[object Float64Array]': 11,
  '[object Generator]': 12,
  '[object Int8Array]': 13,
  '[object Int16Array]': 14,
  '[object Map]': 15,
  '[object Number]': 16,
  '[object Object]': 17,
  '[object Promise]': 18,
  '[object RegExp]': 19,
  '[object Set]': 20,
  '[object String]': 21,
  '[object Uint8Array]': 22,
  '[object Uint8ClampedArray]': 23,
  '[object Uint16Array]': 24,
  '[object Uint32Array]': 25,
  '[object WeakMap]': 26,
  '[object WeakSet]': 27,
  ELEMENT: 28,
  CUSTOM: 29,
} as const;

const NON_ENUMERABLE_CLASSES = {
  '[object Generator]': 1,
  '[object Promise]': 2,
  '[object WeakMap]': 3,
  '[object WeakSet]': 4,
} as const;

const TYPED_ARRAY_CLASSES = {
  '[object Float32Array]': 1,
  '[object Float64Array]': 2,
  '[object Int8Array]': 3,
  '[object Int16Array]': 4,
  '[object Uint8Array]': 5,
  '[object Uint8ClampedArray]': 6,
  '[object Uint16Array]': 7,
  '[object Uint32Array]': 8,
} as const;

const RECURSIVE_CLASSES = {
  '[object Arguments]': 1,
  '[object Array]': 2,
  '[object ArrayBuffer]': 3,
  '[object DataView]': 4,
  '[object Float32Array]': 5,
  '[object Float64Array]': 6,
  '[object Int8Array]': 7,
  '[object Int16Array]': 8,
  '[object Map]': 9,
  '[object Object]': 1,
  '[object Set]': 11,
  '[object Uint8Array]': 12,
  '[object Uint8ClampedArray]': 13,
  '[object Uint16Array]': 14,
  '[object Uint32Array]': 15,
  CUSTOM: 16,
} as const;

const TYPES = {
  string: 0,
  number: 1,
  bigint: 2,
  boolean: 3,
  symbol: 4,
  undefined: 5,
  object: 6,
  function: 7,
} as const;

const XML_ELEMENT_REGEXP = /\[object ([HTML|SVG](.*)Element)\]/;

const toString = Object.prototype.toString;

function stringifyComplexType(value: any, state: RecursiveState) {
  const classType = toString.call(value) as unknown as keyof typeof CLASSES;

  if (RECURSIVE_CLASSES[classType as keyof typeof RECURSIVE_CLASSES]) {
    return JSON.stringify(value, (_key, value) =>
      stringifyRecursiveAsJson(
        classType as keyof typeof RECURSIVE_CLASSES,
        value,
        state,
      ),
    );
  }

  const prefix = `${TYPES.object}:${CLASSES[classType]}`;

  if (classType === '[object Date]') {
    return `${prefix}:${value.getTime()}`;
  }

  if (classType === '[object RegExp]') {
    return `${prefix}:${value.toString()}`;
  }

  if (classType === '[object Event]') {
    return `${prefix}:${JSON.stringify({
      bubbles: value.bubbles,
      cancelBubble: value.cancelBubble,
      cancelable: value.cancelable,
      composed: value.composed,
      currentTarget: value.currentTarget,
      defaultPrevented: value.defaultPrevented,
      eventPhase: value.eventPhase,
      isTrusted: value.isTrusted,
      returnValue: value.returnValue,
      target: value.target,
      type: value.type,
    })}`;
  }

  if (classType === '[object Error]') {
    return `${prefix}:${value.message}:${value.stack}`;
  }

  if (
    NON_ENUMERABLE_CLASSES[classType as keyof typeof NON_ENUMERABLE_CLASSES]
  ) {
    return `${prefix}:NOT_ENUMERABLE`;
  }

  if (classType === '[object DocumentFragment]') {
    return `${prefix}:${stringifyDocumentFragment(value)}`;
  }

  const element = classType.match(XML_ELEMENT_REGEXP);

  if (element) {
    return `${CLASSES.ELEMENT}:${element[1]}:${value.outerHTML}`;
  }

  // This would only be hit with custom `toStringTag` values
  return JSON.stringify(value, (key, value) =>
    stringifyRecursiveAsJson('CUSTOM', value, state),
  );
}

function stringifyRecursiveAsJson(
  classType: keyof typeof RECURSIVE_CLASSES,
  value: any,
  state: RecursiveState,
) {
  const prefix = `${TYPES.object}:${CLASSES[classType]}`;
  const cached = state.cache.get(value);

  if (cached) {
    return `${prefix}:RECURSIVE${cached}`;
  }

  state.cache.set(value, ++state.id);

  if (classType === '[object Object]') {
    return `${prefix}:${stringifyObject(value, state)}`;
  }

  if (classType === '[object Array]' || classType === '[object Arguments]') {
    return `${prefix}:${stringifyArray(value, state)}`;
  }

  if (classType === '[object Map]') {
    return `${prefix}:${stringifyMap(value, state)}`;
  }

  if (classType === '[object Set]') {
    return `${prefix}:${stringifySet(value, state)}`;
  }

  if (TYPED_ARRAY_CLASSES[classType as keyof typeof TYPED_ARRAY_CLASSES]) {
    return `${prefix}:${value.join()}`;
  }

  if (classType === '[object ArrayBuffer]') {
    return `${prefix}:${stringifyArrayBuffer(value)}`;
  }

  if (classType === '[object DataView]') {
    return `${prefix}:${stringifyArrayBuffer(value.buffer)}`;
  }

  return `${CLASSES.CUSTOM}:${stringifyObject(value, state)}`;
}

function stringifySimpleType(type: keyof typeof TYPES, value: any) {
  return `${TYPES[type]}:${
    type === 'function' || type === 'symbol' ? value.toString() : value
  }`;
}

export function stringifyArray(value: any[], state: RecursiveState) {
  const result: string[] = [];

  for (let index = 0, length = value.length; index < length; ++index) {
    result[index] = stringify(value[index], state);
  }

  return result.join();
}

export function stringifyArrayBufferModern(buffer: ArrayBufferLike): string {
  return Buffer.from(buffer).toString('utf8');
}

export function stringifyArrayBufferFallback(buffer: ArrayBufferLike): string {
  return String.fromCharCode.apply(
    null,
    new Uint16Array(buffer) as unknown as number[],
  );
}

export function stringifyArrayBufferNone(): string {
  return 'UNSUPPORTED';
}

export function stringifyDocumentFragment(fragment: DocumentFragment): string {
  const children = fragment.children;
  const innerHTML: string[] = [];

  for (let index = 0; index < children.length; ++index) {
    innerHTML[index] = children[index].outerHTML;
  }

  return innerHTML.join();
}

const stringifyArrayBuffer =
  typeof Buffer !== 'undefined' && typeof Buffer.from === 'function'
    ? stringifyArrayBufferModern
    : typeof Uint16Array === 'function'
    ? stringifyArrayBufferFallback
    : stringifyArrayBufferNone;

export function stringifyMap(map: Map<any, any>, state: RecursiveState) {
  const result: string[] | Array<[string, string]> = [];

  let index = 0;
  map.forEach((value, key) => {
    result[index++] = [stringify(key, state), stringify(value, state)];
  });

  sort(result, sortByKey);

  for (let index = 0, length = result.length; index < length; ++index) {
    result[index] = `[${result[index][0]},${result[index][1]}]`;
  }

  return result.join();
}

export function stringifyObject(
  value: Record<string, any>,
  state: RecursiveState,
) {
  const result: string[] | Array<[string, string]> = [];
  const properties = Object.getOwnPropertyNames(value);

  for (let index = 0, length = properties.length; index < length; ++index) {
    result[index] = [
      properties[index],
      stringify(value[properties[index]], state),
    ];
  }

  sort(result, sortByKey);

  for (let index = 0, length = result.length; index < length; ++index) {
    result[index] = `${result[index][0]}:${result[index][1]}`;
  }

  return `{${result.join()}}`;
}

export function stringifySet(set: Set<any>, state: RecursiveState) {
  const result: string[] = [];

  let index = 0;
  set.forEach((value) => {
    result[index++] = stringify(value, state);
  });

  sort(result, sortBySelf);

  return result.join();
}

export function stringify(
  value: any,
  state: RecursiveState | undefined,
): string {
  const type = typeof value;

  return type === 'object' && value
    ? stringifyComplexType(value, state || { cache: new WeakMap(), id: 1 })
    : stringifySimpleType(type, value);
}
