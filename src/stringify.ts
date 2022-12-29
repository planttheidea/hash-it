import {
  ARRAY_LIKE_CLASSES,
  HASHABLE_TYPES,
  NON_ENUMERABLE_CLASSES,
  PrimitiveWrapperClass,
  PRIMITIVE_WRAPPER_CLASSES,
  RECURSIVE_CLASSES,
  SEPARATOR,
  TYPED_ARRAY_CLASSES,
  XML_ELEMENT_REGEXP,
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
import { namespaceComplexValue } from './utils';

interface RecursiveState {
  cache: WeakMap<any, number>;
  id: number;
}

const toString = Object.prototype.toString;

function stringifyComplexType(value: any, state: RecursiveState) {
  const classType = toString.call(value) as unknown as Class;

  if (RECURSIVE_CLASSES[classType as RecursiveClass]) {
    return stringifyRecursiveAsJson(classType as RecursiveClass, value, state);
  }

  if (classType === '[object Date]') {
    return namespaceComplexValue(classType, value.getTime());
  }

  if (classType === '[object RegExp]') {
    return namespaceComplexValue(classType, value.toString());
  }

  if (classType === '[object Event]') {
    return namespaceComplexValue(
      classType,
      [
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
      ].join(),
    );
  }

  if (classType === '[object Error]') {
    return namespaceComplexValue(
      classType,
      value.message + SEPARATOR + value.stack,
    );
  }

  if (classType === '[object DocumentFragment]') {
    return namespaceComplexValue(classType, stringifyDocumentFragment(value));
  }

  const element = classType.match(XML_ELEMENT_REGEXP);

  if (element) {
    return namespaceComplexValue(
      'ELEMENT',
      element[1] + SEPARATOR + value.outerHTML,
    );
  }

  if (NON_ENUMERABLE_CLASSES[classType as NonEnumerableClass]) {
    return getUnsupportedHash(value, classType);
  }

  if (PRIMITIVE_WRAPPER_CLASSES[classType as PrimitiveWrapperClass]) {
    return namespaceComplexValue(classType, value.toString());
  }

  // This would only be hit with custom `toStringTag` values
  return stringifyRecursiveAsJson('CUSTOM', value, state);
}

function stringifyRecursiveAsJson(
  classType: RecursiveClass,
  value: any,
  state: RecursiveState,
) {
  const cached = state.cache.get(value);

  if (cached) {
    return namespaceComplexValue(classType, 'RECURSIVE~' + cached);
  }

  state.cache.set(value, ++state.id);

  if (classType === '[object Object]') {
    return value[Symbol.iterator]
      ? getUnsupportedHash(value, classType)
      : namespaceComplexValue(classType, stringifyObject(value, state));
  }

  if (ARRAY_LIKE_CLASSES[classType as ArrayLikeClass]) {
    return namespaceComplexValue(classType, stringifyArray(value, state));
  }

  if (classType === '[object Map]') {
    return namespaceComplexValue(classType, stringifyMap(value, state));
  }

  if (classType === '[object Set]') {
    return namespaceComplexValue(classType, stringifySet(value, state));
  }

  if (TYPED_ARRAY_CLASSES[classType as TypedArrayClass]) {
    return namespaceComplexValue(classType, value.join());
  }

  if (classType === '[object ArrayBuffer]') {
    return namespaceComplexValue(classType, stringifyArrayBuffer(value));
  }

  if (classType === '[object DataView]') {
    return namespaceComplexValue(classType, stringifyArrayBuffer(value.buffer));
  }

  if (NON_ENUMERABLE_CLASSES[classType as NonEnumerableClass]) {
    return getUnsupportedHash(value, classType);
  }

  return namespaceComplexValue('CUSTOM', stringifyObject(value, state));
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
    result[index] = '[' + result[index]![0] + ',' + result[index]![1] + ']';
  }

  return '[' + result.join() + ']';
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
    result[index] =
      properties[index]! + ':' + stringify(value[properties[index]!], state);
  }

  return '{' + result.join() + '}';
}

export function stringifySet(set: Set<any>, state: RecursiveState) {
  const result: string[] = new Array(set.size);

  let index = 0;
  set.forEach((value) => {
    result[index++] = stringify(value, state);
  });

  return '[' + sort(result, sortBySelf).join() + ']';
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

  return (
    HASHABLE_TYPES[type] +
    (type === 'function' || type === 'symbol' ? value.toString() : value)
  );
}
