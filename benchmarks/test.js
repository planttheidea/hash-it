'use strict';

const REPEATS = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000];
const TOTAL = REPEATS.reduce((sum, cycles) => {
  return sum + cycles;
}, 0);

exports.test = (name, benchmark) => {
  let totalTime = 0,
      startTime, testTime;

  let displayText = `\n${name}:\n${REPEATS.map(cycles => {
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
};

exports.repeats = REPEATS;
