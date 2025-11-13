import { CLASSES, HASHABLE_TYPES, SEPARATOR } from './constants.js';

import type { Class } from './constants.js';

export function namespaceComplexValue(
  classType: Class,
  value: string | number | boolean,
) {
  return (
    HASHABLE_TYPES.object + SEPARATOR + CLASSES[classType] + SEPARATOR + value
  );
}
