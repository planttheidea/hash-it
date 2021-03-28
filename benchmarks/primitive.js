/* eslint-disable @typescript-eslint/no-var-requires */

const hash = require('../dist/hash-it.min');

const boolean = (exports.boolean = true);
const infinite = (exports.infinite = Infinity);
const notANumber = (exports.notANumber = NaN);
const nul = (exports.nul = null);
const number = (exports.number = 12);
const string = (exports.string = 'foo');
const undef = (exports.undef = undefined);

exports.hashBoolean = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(boolean);
  }
};

exports.hashInfinity = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(infinite);
  }
};

exports.hashNaN = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(notANumber);
  }
};

exports.hashNull = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(nul);
  }
};

exports.hashNumber = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(number);
  }
};

exports.hashString = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(string);
  }
};

exports.hashUndefined = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(undef);
  }
};
