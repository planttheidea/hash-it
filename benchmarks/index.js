/* eslint no-console: 0 */
const fs = require('fs');
const {
  repeats,
  test
} = require('./test');

const {
  hashBoolean,
  hashInfinity,
  hashNaN,
  hashNull,
  hashNumber,
  hashString,
  hashUndefined
} = require('./primitive');
const {
  hashArray,
  hashFunction,
  hashMap,
  hashObject,
  hashRecursiveObject,
  hashRegExp,
  hashSet
} = require('./complex');

const header = () => {
  return `Benchmark (all times in milliseconds): ${repeats.join(', ')}`;
};

let results = [];

const logAndSave = (it) => {
  results.push(it);
  console.log(it);
};

console.log('');

// header
logAndSave(header());

console.log('');
console.log('Starting benchmarks...');
console.log('');

console.log('Primitive objects:');

// primitive tests
logAndSave(test('Boolean', hashBoolean));
logAndSave(test('Infinity', hashInfinity));
logAndSave(test('NaN', hashNaN));
logAndSave(test('null', hashNull));
logAndSave(test('Number', hashNumber));
logAndSave(test('String', hashString));
logAndSave(test('undefined', hashUndefined));

console.log('');
console.log('Complex objects:');

// complex tests
logAndSave(test('Array', hashArray));
logAndSave(test('Function', hashFunction));
logAndSave(test('Map', hashMap));
logAndSave(test('Object', hashObject));
logAndSave(test('Object (recursive)', hashRecursiveObject));
logAndSave(test('RegExp', hashRegExp));
logAndSave(test('Set', hashSet));

console.log('');

// write to file
if (fs && fs.writeFileSync) {
  fs.writeFileSync('results.csv', results.join('\n'), 'utf8');
  console.log('Benchmarks done! Results saved to results.csv');
} else {
  console.log('Benchmarks done!');
}