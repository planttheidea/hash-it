/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const { repeats, test } = require('./test');

const {
  hashBoolean,
  hashInfinity,
  hashNaN,
  hashNull,
  hashNumber,
  hashString,
  hashUndefined,
} = require('./primitive');
const {
  hashArray,
  hashCircularObject,
  hashFunction,
  hashMap,
  hashObject,
  hashRegExp,
  hashSet,
} = require('./complex');

const header = () =>
  `Benchmark cycles: ${repeats
    .map((cycles) => cycles.toLocaleString())
    .join(' ')}`;

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

console.log('Standard value objects:');

// primitive tests
logAndSave(test('Boolean', hashBoolean));
logAndSave(test('Infinity', hashInfinity));
logAndSave(test('NaN', hashNaN));
logAndSave(test('null', hashNull));
logAndSave(test('Number', hashNumber));
logAndSave(test('String', hashString));
logAndSave(test('undefined', hashUndefined));
logAndSave(test('Function', hashFunction));
logAndSave(test('RegExp', hashRegExp));

console.log('');
console.log('Nested value objects:');
console.log('');

// complex tests
logAndSave(test('Array', hashArray));
logAndSave(test('Map', hashMap));
logAndSave(test('Object', hashObject));
logAndSave(test('Object (circular)', hashCircularObject));
logAndSave(test('Set', hashSet));

console.log('');

// write to file
if (fs && fs.writeFileSync) {
  fs.writeFileSync('results_latest.txt', results.join('\n'), 'utf8');
  console.log('Benchmarks done! Results saved to results_latest.txt');
} else {
  console.log('Benchmarks done!');
}
