import { hash as hashStringifiedValue } from './hash.js';
import { stringify } from './stringify.js';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function hash<Value>(value: Value): number {
  return hashStringifiedValue(stringify(value, undefined));
}
