/* eslint-disable @typescript-eslint/no-unused-vars */

import hash from '../dist/esm/index.mjs';

export const boolean = true;
export const infinite = Infinity;
export const notANumber = NaN;
export const nul = null;
export const number = 123;
export const string = 'foo';
export const undef = undefined;

export const hashBoolean = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(boolean);
  }
};

export const hashInfinity = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(infinite);
  }
};

export const hashNaN = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(notANumber);
  }
};

export const hashNull = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(nul);
  }
};

export const hashNumber = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(number);
  }
};

export const hashString = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(string);
  }
};

export const hashUndefined = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(undef);
  }
};
