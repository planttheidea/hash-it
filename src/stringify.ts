import { getUnsupportedHash } from './cache.js';
import type { Class, RecursiveClass } from './constants.js';
import {
  ARRAY_LIKE_CLASSES,
  HASHABLE_TYPES,
  NON_ENUMERABLE_CLASSES,
  PRIMITIVE_WRAPPER_CLASSES,
  RECURSIVE_CLASSES,
  SEPARATOR,
  STRING_PREFIXES,
  TABLED_LENGTHS,
  TYPED_ARRAY_CLASSES,
  XML_ELEMENT_REGEXP,
} from './constants.js';
import { delimit, namespaceComplexValue } from './utils.js';

interface RecursiveState {
  /**
   * Doubles as the ancestor registry and the memoization table. A `number`
   * entry is the depth of a value currently being stringified higher up the
   * path, while a `string` entry is the completed result for a value that has
   * already been fully stringified.
   */
  cache: WeakMap<any, number | string>;
  /**
   * Incremented whenever an ancestor back-reference is emitted, used to decide
   * whether a result is position-independent and therefore safe to memoize.
   */
  cycles: number;
  depth: number;
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const toString = Object.prototype.toString;

function stringifyComplexType(value: any, classType: Class, state: RecursiveState) {
  if (RECURSIVE_CLASSES[classType]) {
    return stringifyRecursiveAsJson(classType, value, state);
  }

  if (classType === '[object Date]') {
    return namespaceComplexValue(classType, value.getTime());
  }

  if (classType === '[object RegExp]') {
    return namespaceComplexValue(classType, value.toString());
  }

  if (classType === '[object Event]') {
    return namespaceComplexValue(classType, stringifyEvent(value, state));
  }

  if (classType === '[object Error]') {
    return namespaceComplexValue(classType, delimit('' + value.message) + delimit('' + value.stack));
  }

  if (classType === '[object DocumentFragment]') {
    return namespaceComplexValue(classType, stringifyDocumentFragment(value));
  }

  const element = classType.match(XML_ELEMENT_REGEXP);

  if (element) {
    return namespaceComplexValue('ELEMENT', delimit(element[1]!) + delimit(value.outerHTML));
  }

  if (NON_ENUMERABLE_CLASSES[classType]) {
    return getUnsupportedHash(value, classType);
  }

  if (PRIMITIVE_WRAPPER_CLASSES[classType]) {
    return namespaceComplexValue(classType, value.toString());
  }

  // This would only be hit with custom `toStringTag` values
  return stringifyRecursiveAsJson('CUSTOM', value, state);
}

function stringifyRecursiveAsJson(classType: RecursiveClass, value: any, state: RecursiveState) {
  const cached = state.cache.get(value);

  if (cached != null) {
    if (typeof cached === 'number') {
      // A cycle. The ancestor is identified by its depth rather than by visit
      // order, so the same structure encodes identically regardless of which
      // sibling happened to be traversed first.
      ++state.cycles;

      return namespaceComplexValue(classType, 'RECURSIVE~' + cached);
    }

    // Already stringified elsewhere in this pass. Reusing the result keeps
    // shared references from depending on traversal order, and keeps a value
    // referenced many times from being walked many times.
    return cached;
  }

  const cycles = state.cycles;

  state.cache.set(value, state.depth++);

  const result = stringifyRecursiveValue(classType, value, state);

  --state.depth;

  if (state.cycles === cycles) {
    state.cache.set(value, result);
  } else {
    // The result embeds an ancestor depth, so it is only valid at the position
    // it was produced and must not be reused.
    state.cache.delete(value);
  }

  return result;
}

function stringifyRecursiveValue(classType: RecursiveClass, value: any, state: RecursiveState) {
  if (classType === '[object Object]') {
    return namespaceComplexValue(classType, stringifyObject(value, state));
  }

  if (ARRAY_LIKE_CLASSES[classType]) {
    return namespaceComplexValue(classType, stringifyArray(value, state, classType));
  }

  if (classType === '[object Map]') {
    return namespaceComplexValue(classType, stringifyMap(value, state));
  }

  if (classType === '[object Set]') {
    return namespaceComplexValue(classType, stringifySet(value, state));
  }

  if (TYPED_ARRAY_CLASSES[classType]) {
    return namespaceComplexValue(classType, value.join());
  }

  if (classType === '[object ArrayBuffer]' || classType === '[object SharedArrayBuffer]') {
    return namespaceComplexValue(classType, stringifyArrayBuffer(value));
  }

  if (classType === '[object DataView]') {
    return namespaceComplexValue(
      classType,
      stringifyArrayBuffer(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength)),
    );
  }

  if (NON_ENUMERABLE_CLASSES[classType]) {
    return getUnsupportedHash(value, classType);
  }

  return namespaceComplexValue('CUSTOM', stringifyObject(value, state));
}

export function stringifyArray(value: any[], state: RecursiveState, classType?: Class) {
  const length = value.length;
  const result: string[] = new Array(length);

  let index = length;

  while (--index >= 0) {
    result[index] = stringify(value[index], state);
  }

  // Own keys are ordered indices-first, so a named property can only ever be
  // last. If the count matches and the final key is the canonical last index,
  // the array is dense with nothing the indexed pass above missed. This is only
  // a filter - anything else falls through to the exact check below.
  const keys = Object.keys(value);

  if (keys.length === length && (length === 0 || keys[length - 1] === '' + (length - 1))) {
    return result.join();
  }

  return result.join() + stringifyArrayProperties(value, length, state, classType);
}

/**
 * Stringify the own properties of an array-like that the indexed pass does not
 * reach. Returns an empty string when there are none, so that a sparse array
 * hashes the same as the equivalent dense one.
 */
function stringifyArrayProperties(
  value: Record<string, any>,
  length: number,
  state: RecursiveState,
  classType?: Class,
) {
  const properties = Object.getOwnPropertyNames(value);
  const extra: string[] = [];

  for (let index = 0, total = properties.length; index < total; ++index) {
    const property = properties[index]!;

    // `length` is intrinsic to both classes, and an `arguments` object also
    // carries an intrinsic `callee` that is a poisoned accessor under strict
    // mode. Neither is part of the value being hashed.
    if (property === 'length' || (classType === '[object Arguments]' && property === 'callee')) {
      continue;
    }

    const asIndex = +property;

    // Canonical indices were covered by the indexed pass. Comparing against the
    // round-tripped number rejects near-index names such as `'01'` or `'1e2'`.
    if (asIndex >= 0 && asIndex < length && '' + asIndex === property) {
      continue;
    }

    extra.push(property);
  }

  if (!extra.length) {
    return '';
  }

  // Sorted so the hash does not depend on assignment order, matching how
  // ordinary object keys are handled.
  extra.sort();

  const result: string[] = new Array(extra.length);

  let index = extra.length;

  while (--index >= 0) {
    result[index] = delimit(extra[index]!) + stringify(value[extra[index]!], state);
  }

  return '{' + result.join() + '}';
}

export function stringifyArrayBufferModern(buffer: ArrayBufferLike): string {
  return Buffer.from(buffer).toString('latin1');
}

const FROM_CHAR_CODE_CHUNK_SIZE = 0x8000;

export function stringifyArrayBufferFallback(buffer: ArrayBufferLike): string {
  const bytes = new Uint8Array(buffer);

  const chunks: string[] = new Array(Math.ceil(bytes.length / FROM_CHAR_CODE_CHUNK_SIZE));

  let chunkIndex = 0;

  for (let index = 0; index < bytes.length; index += FROM_CHAR_CODE_CHUNK_SIZE) {
    chunks[chunkIndex++] = String.fromCharCode.apply(
      null,
      bytes.subarray(index, index + FROM_CHAR_CODE_CHUNK_SIZE) as unknown as number[],
    );
  }

  return chunks.join('');
}

export function stringifyArrayBufferNone(): string {
  return 'UNSUPPORTED';
}

export function stringifyDocumentFragment(fragment: DocumentFragment): string {
  const children = fragment.children;

  let index = children.length;

  const innerHTML: string[] = new Array(index);

  while (--index >= 0) {
    innerHTML[index] = delimit(children[index]!.outerHTML);
  }

  return innerHTML.join('');
}

const stringifyArrayBuffer =
  typeof Buffer !== 'undefined' && typeof Buffer.from === 'function'
    ? stringifyArrayBufferModern
    : typeof Uint8Array === 'function'
      ? stringifyArrayBufferFallback
      : stringifyArrayBufferNone;

export function stringifyEvent(value: Event, state: RecursiveState) {
  return [
    value.bubbles,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    value.cancelBubble,
    value.cancelable,
    value.composed,
    stringify(value.currentTarget, state),
    value.defaultPrevented,
    value.eventPhase,
    value.isTrusted,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    value.returnValue,
    stringify(value.target, state),
    value.type,
  ].join(SEPARATOR);
}

export function stringifyMap(map: Map<any, any>, state: RecursiveState) {
  const result: string[] = new Array(map.size);

  let index = 0;
  map.forEach((value, key) => {
    result[index++] = '[' + stringify(key, state) + ',' + stringify(value, state) + ']';
  });

  return '[' + result.sort().join() + ']';
}

export function stringifyObject(value: Record<string, any>, state: RecursiveState) {
  const properties = Object.getOwnPropertyNames(value).sort();
  const result: string[] = new Array(properties.length);

  let index = properties.length;

  while (--index >= 0) {
    const property = properties[index]!;

    result[index] = delimit(property) + stringify(value[property], state);
  }

  return '{' + result.join() + '}';
}

export function stringifySet(set: Set<any>, state: RecursiveState) {
  const result: string[] = new Array(set.size);

  let index = 0;
  set.forEach((value) => {
    result[index++] = stringify(value, state);
  });

  return '[' + result.sort().join() + ']';
}

export function stringify(value: any, state: RecursiveState | undefined): string {
  const type = typeof value;

  if (value == null) {
    return HASHABLE_TYPES.empty + value;
  }

  if (type === 'object') {
    return stringifyComplexType(
      value,
      toString.call(value),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      state || { cache: new WeakMap(), cycles: 0, depth: 0 },
    );
  }

  if (type === 'string') {
    const length = value.length;

    // Inlined rather than delegated so the hottest leaf avoids a call.
    return length < TABLED_LENGTHS
      ? STRING_PREFIXES[length]! + value
      : HASHABLE_TYPES.string! + length + SEPARATOR + value;
  }

  if (type === 'function' || type === 'symbol') {
    return HASHABLE_TYPES[type] + delimit(value.toString());
  }

  if (type === 'boolean') {
    return HASHABLE_TYPES.boolean! + +value;
  }

  return HASHABLE_TYPES[type] + value;
}
