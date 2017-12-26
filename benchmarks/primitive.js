'use strict';

const hashIt = require('../lib').default;

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
    val = hashIt(boolean);
  }
};

exports.hashInfinity = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hashIt(infinite);
  }
};

exports.hashNaN = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hashIt(notANumber);
  }
};

exports.hashNull = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hashIt(nul);
  }
};

exports.hashNumber = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hashIt(number);
  }
};

exports.hashString = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hashIt(string);
  }
};

exports.hashUndefined = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hashIt(undef);
  }
};
