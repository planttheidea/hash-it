import { hash } from './hash';
import { stringify } from './stringify';

export default function hashIt(value: any): number {
  return hash(stringify(value, undefined));
}
