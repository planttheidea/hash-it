import {
  ARRAY_LIKE_CLASSES,
  CLASSES,
  HASHABLE_TYPES,
  NON_ENUMERABLE_CLASSES,
  PrimitiveWrapperClass,
  PRIMITIVE_WRAPPER_CLASSES,
  RECURSIVE_CLASSES,
  TYPED_ARRAY_CLASSES,
} from './constants';
import { sort, sortByKey, sortBySelf } from './sort';

import type {
  ArrayLikeClass,
  Class,
  NonEnumerableClass,
  RecursiveClass,
  TypedArrayClass,
} from './constants';
import { getUnsupportedHash } from './cache';

interface RecursiveState {
  cache: WeakMap<any, number>;
  id: number;
}

const XML_ELEMENT_REGEXP = /\[object ([HTML|SVG](.*)Element)\]/;

const toString = Object.prototype.toString;

function stringifyComplexType(value: any, state: RecursiveState) {
  const classType = toString.call(value) as unknown as Class;

  if (RECURSIVE_CLASSES[classType as RecursiveClass]) {
    return stringifyRecursiveAsJson(classType as RecursiveClass, value, state);
  }

  const prefix = `${HASHABLE_TYPES.object}:${CLASSES[classType]}`;

  if (classType === '[object Date]') {
    return `${prefix}:${value.getTime()}`;
  }

  if (classType === '[object RegExp]') {
    return `${prefix}:${value.toString()}`;
  }

  if (classType === '[object Event]') {
    return `${prefix}:${[
      value.bubbles,
      value.cancelBubble,
      value.cancelable,
      value.composed,
      value.currentTarget,
      value.defaultPrevented,
      value.eventPhase,
      value.isTrusted,
      value.returnValue,
      value.target,
      value.type,
    ].join()}`;
  }

  if (classType === '[object Error]') {
    return `${prefix}:${value.message}:${value.stack}`;
  }

  if (classType === '[object DocumentFragment]') {
    return `${prefix}:${stringifyDocumentFragment(value)}`;
  }

  const element = classType.match(XML_ELEMENT_REGEXP);

  if (element) {
    return `${CLASSES.ELEMENT}:${element[1]}:${value.outerHTML}`;
  }

  if (NON_ENUMERABLE_CLASSES[classType as NonEnumerableClass]) {
    return getUnsupportedHash(value, prefix);
  }

  if (PRIMITIVE_WRAPPER_CLASSES[classType as PrimitiveWrapperClass]) {
    return `${prefix}:${value.toString()}`;
  }

  // This would only be hit with custom `toStringTag` values
  return stringifyRecursiveAsJson('CUSTOM', value, state);
}

function stringifyRecursiveAsJson(
  classType: RecursiveClass,
  value: any,
  state: RecursiveState,
) {
  const prefix = `${HASHABLE_TYPES.object}:${CLASSES[classType]}`;
  const cached = state.cache.get(value);

  if (cached) {
    return `${prefix}:RECURSIVE~${cached}`;
  }

  state.cache.set(value, ++state.id);

  if (classType === '[object Object]') {
    return value[Symbol.iterator]
      ? getUnsupportedHash(value, prefix)
      : `${prefix}:${stringifyObject(value, state)}`;
  }

  if (ARRAY_LIKE_CLASSES[classType as ArrayLikeClass]) {
    return `${prefix}:${stringifyArray(value, state)}`;
  }

  if (classType === '[object Map]') {
    return `${prefix}:${stringifyMap(value, state)}`;
  }

  if (classType === '[object Set]') {
    return `${prefix}:${stringifySet(value, state)}`;
  }

  if (TYPED_ARRAY_CLASSES[classType as TypedArrayClass]) {
    return `${prefix}:${value.join()}`;
  }

  if (classType === '[object ArrayBuffer]') {
    return `${prefix}:${stringifyArrayBuffer(value)}`;
  }

  if (classType === '[object DataView]') {
    return `${prefix}:${stringifyArrayBuffer(value.buffer)}`;
  }

  if (NON_ENUMERABLE_CLASSES[classType as NonEnumerableClass]) {
    return getUnsupportedHash(value, prefix);
  }

  return `${CLASSES.CUSTOM}:${stringifyObject(value, state)}`;
}

export function stringifyArray(value: any[], state: RecursiveState) {
  let index = value.length;

  const result: string[] = new Array(index);

  while (--index >= 0) {
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

  let index = children.length;

  const innerHTML: string[] = new Array(index);

  while (--index >= 0) {
    innerHTML[index] = children[index]!.outerHTML;
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
  const result: string[] | Array<[string, string]> = new Array(map.size);

  let index = 0;
  map.forEach((value, key) => {
    result[index++] = [stringify(key, state), stringify(value, state)];
  });

  sort(result, sortByKey);

  while (--index >= 0) {
    result[index] = `[${result[index]![0]},${result[index]![1]}]`;
  }

  return `[${result.join()}]`;
}

export function stringifyObject(
  value: Record<string, any>,
  state: RecursiveState,
) {
  const properties = sort(Object.getOwnPropertyNames(value), sortBySelf);
  const length = properties.length;
  const result: string[] = new Array(length);

  let index = length;

  while (--index >= 0) {
    result[index] = `${properties[index]!}:${stringify(
      value[properties[index]!],
      state,
    )}`;
  }

  return `{${result.join()}}`;
}

export function stringifySet(set: Set<any>, state: RecursiveState) {
  const result: string[] = new Array(set.size);

  let index = 0;
  set.forEach((value) => {
    result[index++] = stringify(value, state);
  });

  sort(result, sortBySelf);

  return `[${result.join()}]`;
}

export function stringify(
  value: any,
  state: RecursiveState | undefined,
): string {
  const type = typeof value;

  if (type === 'object' && value) {
    return stringifyComplexType(
      value,
      state || { cache: new WeakMap(), id: 1 },
    );
  }

  const prefix = HASHABLE_TYPES[type];

  if (type === 'function' || type === 'symbol') {
    return `${prefix}:${value.toString()}`;
  }

  return `${prefix}:${value}`;
}
