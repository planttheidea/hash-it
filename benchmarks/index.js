import * as fs from 'fs';
import {
  hashArray,
  hashBoolean,
  hashCircularObject,
  hashDate,
  hashError,
  hashEvent,
  hashFunction,
  hashInfinity,
  hashMap,
  hashNaN,
  hashNull,
  hashNumber,
  hashObject,
  hashRegExp,
  hashSet,
  hashString,
  hashUndefined,
} from './tests.js';

const REPEATS = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000];
const TOTAL = REPEATS.reduce((sum, cycles) => sum + cycles, 0);

function runTest(name, benchmark) {
  let totalTime = 0;
  let startTime;
  let testTime;

  let displayText = `\n${name}:\n${REPEATS.map((cycles) => {
    startTime = Date.now();

    benchmark(cycles);

    testTime = Date.now() - startTime;

    if (global && global.gc) {
      global.gc();
    }

    totalTime += testTime;

    return `${cycles.toLocaleString()}: ${testTime / 1000} sec`;
  }).join('\n')}`;

  displayText += `\nAverage: ${Math.round((TOTAL / totalTime) * 1000).toLocaleString()} ops/sec`;

  return displayText;
}

const header = () => `Benchmark cycles: ${REPEATS.map((cycles) => cycles.toLocaleString()).join(' ')}`;

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
logAndSave(runTest('Boolean', hashBoolean));
logAndSave(runTest('Infinity', hashInfinity));
logAndSave(runTest('NaN', hashNaN));
logAndSave(runTest('null', hashNull));
logAndSave(runTest('Number', hashNumber));
logAndSave(runTest('String', hashString));
logAndSave(runTest('undefined', hashUndefined));
logAndSave(runTest('Function', hashFunction));
logAndSave(runTest('RegExp', hashRegExp));

console.log('');
console.log('Nested value objects:');
console.log('');

// complex tests
logAndSave(runTest('Array', hashArray));
logAndSave(runTest('Date', hashDate));
logAndSave(runTest('Error', hashError));
logAndSave(runTest('Event', hashEvent));
logAndSave(runTest('Map', hashMap));
logAndSave(runTest('Object', hashObject));
logAndSave(runTest('Object (circular)', hashCircularObject));
logAndSave(runTest('Set', hashSet));

console.log('');

// write to file
if (fs && fs.writeFileSync) {
  fs.writeFileSync('results_latest.txt', results.join('\n'), 'utf8');
  console.log('Benchmarks done! Results saved to results_latest.txt');
} else {
  console.log('Benchmarks done!');
}
