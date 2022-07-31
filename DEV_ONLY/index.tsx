import hashIt from '../src';

const object: Record<string, any> = {
  standard: {},
  deeply: {
    nested: {},
  },
  nested: {},
};

object.deeply.nested.value = object;
object.nested = object.standard;

const el = document.createElement('div');

el.innerHTML = '<span>foo</span>';

console.log('string', hashIt('string'));
console.log('number', hashIt(123));
console.log('bigint', hashIt(BigInt(9007199254740991)));
console.log('boolean', hashIt(true));
console.log('symbol', hashIt(Symbol('foo')));
console.log('undefined', hashIt(undefined));
console.log('null', hashIt(null));
console.log('date', hashIt(new Date(2000, 0, 1)));
console.log('regexp', hashIt(/foo/g));
console.log('event', hashIt(new Event('foo')));
console.log('error', hashIt(new Error('boom')));
console.log('promise', hashIt(Promise.resolve()));
console.log('weakmap', hashIt(new WeakMap()));
console.log('element', hashIt(el));
console.log('object', hashIt({ foo: 'bar', bar: 'baz' }));
console.log('recursive object', hashIt(object));
console.log(
  'function',
  hashIt(function fn() {
    console.log('hello');
  }),
);
console.log(
  'map',
  hashIt(
    new Map<any, any>([
      ['foo', 'bar'],
      [{ bar: 'baz' }, 'quz'],
    ]),
  ),
  hashIt(
    new Map<any, any>([
      [{ bar: 'baz' }, 'quz'],
      ['foo', 'bar'],
    ]),
  ),
);
console.log(
  'set',
  hashIt(new Set<any>(['foo', { bar: 'baz' }])),
  hashIt(new Set<any>([{ bar: 'baz' }, 'foo'])),
);
