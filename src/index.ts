import { hash } from './hash';
import { stringify } from './stringify';

export default function hashIt<Value>(value: Value): number {
  return hash(stringify(value, undefined));
}
