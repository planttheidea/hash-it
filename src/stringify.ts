import sort, { sortByKey, sortBySelf } from "./sort";

interface RecursiveState {
  cache: WeakMap<any, number>;
  id: number;
}

enum Classes {
  "[object Arguments]",
  "[object Array]",
  "[object ArrayBuffer]",
  "[object BigInt]",
  "[object Boolean]",
  "[object DataView]",
  "[object Date]",
  "[object DocumentFragment]",
  "[object Error]",
  "[object Event]",
  "[object Float32Array]",
  "[object Float64Array]",
  "[object Generator]",
  "[object Int8Array]",
  "[object Int16Array]",
  "[object Map]",
  "[object Number]",
  "[object Object]",
  "[object Promise]",
  "[object RegExp]",
  "[object Set]",
  "[object String]",
  "[object Uint8Array]",
  "[object Uint8ClampedArray]",
  "[object Uint16Array]",
  "[object Uint32Array]",
  "[object WeakMap]",
  "[object WeakSet]",
  "ELEMENT",
  "CUSTOM",
}

enum NonEnumerableClasses {
  "[object Generator]" = 1,
  "[object Promise]" = 2,
  "[object WeakMap]" = 3,
  "[object WeakSet]" = 4,
}

enum TypedArrayClasses {
  "[object Float32Array]" = 1,
  "[object Float64Array]" = 2,
  "[object Int8Array]" = 3,
  "[object Int16Array]" = 4,
  "[object Uint8Array]" = 5,
  "[object Uint8ClampedArray]" = 6,
  "[object Uint16Array]" = 7,
  "[object Uint32Array]" = 8,
}

enum Types {
  string,
  number,
  bigint,
  boolean,
  symbol,
  undefined,
  object,
  function,
}

const XML_ELEMENT_REGEXP = /\[object ([HTML|SVG](.*)Element)\]/;

const toString = Object.prototype.toString;

export function stringifyAnyObject(value: any, state: RecursiveState) {
  const classType = toString.call(value) as unknown as keyof typeof Classes;
  const prefix = `${Types.object}:${Classes[classType]}`;

  const cached = state.cache.get(value);

  if (cached) {
    return `${prefix}:RECURSIVE${cached}`;
  }

  if (classType === "[object Date]") {
    return `${prefix}:${value.getTime()}`;
  }

  if (classType === "[object RegExp]") {
    return `${prefix}:${value.toString()}`;
  }

  state.cache.set(value, state.id++);

  if (classType === "[object Object]") {
    return `${prefix}:${stringifyObject(value, state)}`;
  }

  if (classType === "[object Array]" || classType === "[object Arguments]") {
    return `${prefix}:${stringifyArray(value, state)}`;
  }

  if (classType === "[object Map]") {
    return `${prefix}:${stringifyMap(value, state)}`;
  }

  if (classType === "[object Set]") {
    return `${prefix}:${stringifySet(value, state)}`;
  }

  if (classType === "[object Event]") {
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

  if (classType === "[object Error]") {
    return `${prefix}:${value.message}:${value.stack}`;
  }

  if (NonEnumerableClasses[classType as keyof typeof NonEnumerableClasses]) {
    return `${prefix}:NOT_ENUMERABLE`;
  }

  if (TypedArrayClasses[classType as keyof typeof TypedArrayClasses]) {
    return `${prefix}:${value.join()}`;
  }

  if (classType === "[object ArrayBuffer]") {
    return `${prefix}:${stringifyArrayBuffer(value)}`;
  }

  if (classType === "[object DataView]") {
    return `${prefix}:${stringifyArrayBuffer(value.buffer)}`;
  }

  if (XML_ELEMENT_REGEXP.test(value)) {
    return `${Classes.ELEMENT}:${value.outerHTML}`;
  }

  if (classType === "[object DocumentFragment]") {
    return `${prefix}:${stringifyDocumentFragment(value)}`;
  }

  return `${Classes.CUSTOM}:${stringifyObject(value, state)}`;
}

export function stringifyArray(value: any[], state: RecursiveState) {
  const result: string[] = [];

  for (let index = 0, length = value.length; index < length; ++index) {
    result[index] = stringifyValue(value[index], state);
  }

  return result.join();
}

export function stringifyArrayBufferModern(buffer: ArrayBufferLike): string {
  return Buffer.from(buffer).toString("utf8");
}

export function stringifyArrayBufferFallback(buffer: ArrayBufferLike): string {
  return String.fromCharCode.apply(
    null,
    new Uint16Array(buffer) as unknown as number[]
  );
}

export function stringifyArrayBufferNone(): string {
  return "UNSUPPORTED";
}

export function stringifyDocumentFragment(fragment: DocumentFragment): string {
  const children = fragment.children;
  const innerHTML: string[] = [];

  for (let index = 0; index < children.length; ++index) {
    innerHTML.push(children[index].outerHTML);
  }

  return innerHTML.join();
}

const stringifyArrayBuffer =
  typeof Buffer !== "undefined" && typeof Buffer.from === "function"
    ? stringifyArrayBufferModern
    : typeof Uint16Array === "function"
    ? stringifyArrayBufferFallback
    : stringifyArrayBufferNone;

export function stringifyMap(map: Map<any, any>, state: RecursiveState) {
  const result: string[] | Array<[string, string]> = [];

  let index = 0;
  map.forEach((value, key) => {
    result[index++] = [
      stringifyValue(key, state),
      stringifyValue(value, state),
    ];
  });

  sort(result, sortByKey);

  for (let index = 0, length = result.length; index < length; ++index) {
    result[index] = `[${result[index][0]},${result[index][1]}]`;
  }

  return result.join();
}

export function stringifyObject(
  value: Record<string, any>,
  state: RecursiveState
) {
  const result: string[] | Array<[string, string]> = [];
  const properties = Object.getOwnPropertyNames(value);

  for (let index = 0, length = properties.length; index < length; ++index) {
    const property = properties[index];

    result[index] = [
      stringifyValue(property, state),
      stringifyValue(value[property], state),
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
    result[index++] = stringifyValue(value, state);
  });

  sort(result, sortBySelf);

  return result.join();
}

export function stringifyValue(value: any, state?: RecursiveState): string {
  const type = typeof value;

  if (value) {
    if (type === "object") {
      return stringifyAnyObject(
        value,
        state || { cache: new WeakMap(), id: 1 }
      );
    }

    if (type === "function" || type === "symbol") {
      return `${Types[type]}:${value.toString()}`;
    }
  }

  return `${Types[type]}:${value}`;
}

export default function stringify(value: any): string {
  return stringifyValue(value);
}
