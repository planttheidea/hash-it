import {
  BAILOUT_TAGS,
  ITERABLE_TAGS,
  NORMALIZED_TAGS,
  OBJECT_CLASS,
  OBJECT_CLASS_TYPE,
  PRIMITIVE_TAGS,
  SELF_TAGS,
  TO_STRING_TAGS,
  TYPED_ARRAY_TAGS,
} from './constants';
import { getStringifiedArrayBuffer } from './arrayBuffer';

type ObjectClass = keyof typeof OBJECT_CLASS;

const FUNCTION_NAME_REGEX = /^\s*function\s*([^(]*)/i;
const XML_ELEMENT_REGEXP = /\[object ([HTML|SVG](.*)Element)\]/;

const toString = Object.prototype.toString;
const keys = Object.keys;

/**
 * get the name of the function based on a series of fallback attempts
 *
 * @param fn the function to test
 * @returns the function name
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function getConstructorName(fn: Function) {
  return (
    fn.name ||
    (fn.toString().match(FUNCTION_NAME_REGEX) || [])[1] ||
    'anonymous'
  );
}

/**
 * get the event object sorted by its properties
 *
 * @param event the event to sort
 * @returns the event object with all properties sorted
 */
function getSortedEvent(event: Event) {
  return {
    bubbles: event.bubbles,
    cancelBubble: event.cancelBubble,
    cancelable: event.cancelable,
    composed: event.composed,
    currentTarget: event.currentTarget,
    defaultPrevented: event.defaultPrevented,
    eventPhase: event.eventPhase,
    isTrusted: event.isTrusted,
    returnValue: event.returnValue,
    target: event.target,
    type: event.type,
  };
}

/**
 * get the sort result based on the two values to compare
 *
 * @param first the first value to compare
 * @param second the second value to compare
 * @returns should the value be sorted
 */
function shouldSort(first: string, second: string) {
  return first > second;
}

/**
 * get the sort result based on the two pairs to compare
 *
 * @param firstPair the first pair to compare
 * @param secondPair the second pair to compare
 * @returns should the value be sorted
 */
function shouldSortPair(
  firstPair: [string, string],
  secondPair: [string, string],
) {
  return firstPair[0] > secondPair[0];
}

/**
 * sort the array based on the fn passed
 *
 * @param array the array to sort
 * @param fn the sorting function
 * @returns the sorted array
 */
function sort(array: any[], fn: (item: any, comparisonItem: any) => boolean) {
  let subIndex;
  let value;

  for (let index = 0; index < array.length; ++index) {
    value = array[index];

    for (
      subIndex = index - 1;
      ~subIndex && fn(array[subIndex], value);
      --subIndex
    ) {
      array[subIndex + 1] = array[subIndex];
    }

    array[subIndex + 1] = value;
  }

  return array;
}

/**
 * get the pairs in the iterable for stringification
 *
 * @param iterable the iterable to get the pairs for
 * @returns the sorted, stringified entries
 */
function getSortedIterable(
  iterable: Map<any, any> | Set<any>,
  cache: any[],
  keys: string[],
) {
  const isMap = iterable instanceof Map;
  const entries: string[] = [];

  if (isMap) {
    iterable.forEach((value: any, key: any) => {
      entries.push([
        stringify(key, cache, keys),
        stringify(value, cache, keys),
      ] as unknown as string);
    });

    sort(entries, shouldSortPair);

    for (let index = 0, entry; index < entries.length; ++index) {
      entry = entries[index];
      entries[index] = `[${entry[0]},${entry[1]}]`;
    }
  } else {
    iterable.forEach((value: any) => {
      entries.push(stringify(value, cache, keys));
    });

    sort(entries, shouldSort);
  }

  return `${getConstructorName(iterable.constructor)}|[${entries.join(',')}]`;
}

/**
 * get the object with the keys sorted
 *
 * @param object the object to sort
 * @returns the sorted object
 */
function getSortedObject<UnsortedObject>(object: UnsortedObject) {
  const objectKeys = sort(keys(object), shouldSort);
  const newObject = {} as UnsortedObject;

  let key: keyof UnsortedObject;

  for (let index = 0; index < objectKeys.length; ++index) {
    key = objectKeys[index];

    newObject[key] = object[key];
  }

  return newObject;
}

/**
 * build a string based on all the fragment's children
 *
 * @param fragment the fragment to stringify
 * @returns the stringified fragment
 */
function getStringifiedDocumentFragment(fragment: DocumentFragment) {
  const children = fragment.children;
  const innerHTML: string[] = [];

  for (let index = 0; index < children.length; ++index) {
    innerHTML.push(children[index].outerHTML);
  }

  return innerHTML.join(',');
}

/**
 * get the index after that of the value match in the array (faster than
 * native indexOf) to determine the cutoff index for the `splice()` call.
 *
 * @param array the array to get the index of the value at
 * @param value the value to match
 * @returns the index after the value match in the array
 */
function getCutoffIndex(array: any[], value: any) {
  for (let index = 0; index < array.length; ++index) {
    if (array[index] === value) {
      return index + 1;
    }
  }

  return 0;
}

/**
 * get the value normalized for stringification
 *
 * @param value the value to normalize
 * @param sortedCache the cache of sorted objects
 * @param passedTag the previously-calculated tag
 * @returns the normalized value
 */
function getNormalizedValue(
  value: any,
  cache?: any[],
  keys?: string[],
  passedTag?: ObjectClass,
) {
  if (!passedTag) {
    const type = typeof value;

    if (PRIMITIVE_TAGS[type as keyof typeof PRIMITIVE_TAGS]) {
      return `${type}|${value}`;
    }

    if (value === null) {
      return `${value}|${value}`;
    }
  }

  const tag = passedTag || (toString.call(value) as ObjectClass);

  if (SELF_TAGS[tag as keyof typeof SELF_TAGS]) {
    return value;
  }

  if (tag === OBJECT_CLASS_TYPE.Object) {
    return getSortedObject(value);
  }

  if (TO_STRING_TAGS[tag as keyof typeof TO_STRING_TAGS]) {
    return `${OBJECT_CLASS[tag]}|${value.toString()}`;
  }

  if (ITERABLE_TAGS[tag as keyof typeof ITERABLE_TAGS]) {
    return getSortedIterable(value, cache as any[], keys as string[]);
  }

  if (tag === OBJECT_CLASS_TYPE.Date) {
    return `${OBJECT_CLASS[tag]}|${value.getTime()}`;
  }

  if (tag === OBJECT_CLASS_TYPE.Error) {
    return `${OBJECT_CLASS[tag]}|${value.stack}`;
  }

  if (tag === OBJECT_CLASS_TYPE.Event) {
    return getSortedEvent(value);
  }

  if (BAILOUT_TAGS[tag as keyof typeof BAILOUT_TAGS]) {
    return `${OBJECT_CLASS[tag]}|NOT_ENUMERABLE`;
  }

  if (XML_ELEMENT_REGEXP.test(tag)) {
    return `${tag.slice(8, -1)}|${value.outerHTML}`;
  }

  if (tag === OBJECT_CLASS_TYPE.DocumentFragment) {
    return `${OBJECT_CLASS[tag]}|${getStringifiedDocumentFragment(value)}`;
  }

  if (TYPED_ARRAY_TAGS[tag as keyof typeof TYPED_ARRAY_TAGS]) {
    return `${OBJECT_CLASS[tag]}|${value.join(',')}`;
  }

  if (tag === OBJECT_CLASS_TYPE.ArrayBuffer) {
    return `${OBJECT_CLASS[tag]}|${getStringifiedArrayBuffer(value)}`;
  }

  if (tag === OBJECT_CLASS_TYPE.DataView) {
    return `${OBJECT_CLASS[tag]}|${getStringifiedArrayBuffer(value.buffer)}`;
  }

  return value;
}

/**
 * create the replacer function used for stringification
 *
 * @param sortedCache the cache to use for sorting objects
 * @returns function getting the normalized value
 */
function createReplacer(cache: any[] = [], keys: string[] = []) {
  return function (this: any, key: string, value: any) {
    if (typeof value === 'object') {
      if (cache.length) {
        const thisCutoff = getCutoffIndex(cache, this);

        if (thisCutoff === 0) {
          cache.push(this);
        } else {
          cache.splice(thisCutoff);
          keys.splice(thisCutoff);
        }

        keys.push(key);

        const valueCutoff = getCutoffIndex(cache, value);

        if (valueCutoff !== 0) {
          return `[~${keys.slice(0, valueCutoff).join('.') || '.'}]`;
        }

        cache.push(value);
      } else {
        cache[0] = value;
        keys[0] = key;
      }
    }

    if (key && this[key] instanceof Date) {
      return getNormalizedValue(this[key], cache, keys, OBJECT_CLASS_TYPE.Date);
    }

    return getNormalizedValue(value, cache, keys);
  };
}

/**
 * stringify the value based on the options passed
 *
 * @param value the value to stringify
 * @returns the stringified value
 */
function stringify(value: any, cache?: any[], keys?: string[]): string {
  if (!value || typeof value !== 'object') {
    return getNormalizedValue(value, cache, keys);
  }

  const tag = toString.call(value) as ObjectClass;

  if (NORMALIZED_TAGS[tag as keyof typeof NORMALIZED_TAGS]) {
    return getNormalizedValue(value, cache, keys, tag);
  }

  return JSON.stringify(value, createReplacer(cache, keys));
}

export default stringify;
