import { CLASSES, HASHABLE_TYPES, SEPARATOR } from './constants';

import type { Class } from './constants';

export function namespaceComplexValue(
  classType: Class,
  value: string | number | boolean,
) {
  return (
    HASHABLE_TYPES.object + SEPARATOR + CLASSES[classType] + SEPARATOR + value
  );
}
