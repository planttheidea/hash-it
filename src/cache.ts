import { SEPARATOR } from './constants';
import { namespaceComplexValue } from './utils';

import type { Class } from './constants';

export const NON_ENUMERABLE_CLASS_CACHE = new WeakMap<
  NonEnumerableObject,
  string
>();

type NonEnumerableObject =
  | Generator<any, any, any>
  | Promise<any>
  | WeakMap<any, any>
  | WeakSet<any>;

let refId = 0;
export function getUnsupportedHash(
  value: NonEnumerableObject,
  classType: Class,
): string {
  const cached = NON_ENUMERABLE_CLASS_CACHE.get(value);

  if (cached) {
    return cached;
  }

  const toCache = namespaceComplexValue(
    classType,
    'NOT_ENUMERABLE' + SEPARATOR + refId++,
  );

  NON_ENUMERABLE_CLASS_CACHE.set(value, toCache);

  return toCache;
}
