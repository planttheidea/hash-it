import { hash } from './hash.js';
import { stringify } from './stringify.js';

export default function hashIt<Value>(value: Value): number {
  return hash(stringify(value, undefined));
}
