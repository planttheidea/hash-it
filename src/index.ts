import { hash as hashStringifiedValue } from './hash.js';
import { stringify } from './stringify.js';

export function hash<Value>(value: Value): number {
  return hashStringifiedValue(stringify(value, undefined));
}
