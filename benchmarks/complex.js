/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */

import hash from '../dist/esm/index.mjs';

import {
  boolean,
  infinite,
  notANumber,
  nul,
  number,
  string,
  undef,
} from './primitive.js';

const array = [boolean, infinite, notANumber, nul, number, string, undef];
const object = {
  boolean,
  infinite,
  notANumber,
  nul,
  number,
  string,
  undef,
};
const func = function (_foo, _bar) {};
const map = new Map([
  ['foo', 'bar'],
  ['bar', 'baz'],
]);
const regex = /foo/;
const set = new Set(['foo', 'bar', 'baz']);
const recursiveObject = (() => {
  function Circular(value) {
    this.deeply = {
      nested: {
        reference: this,
        value,
      },
    };
  }

  return new Circular();
})();

export const hashArray = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(array, true);
  }
};

export const hashFunction = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(func, true);
  }
};

export const hashMap = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(map, true);
  }
};

export const hashObject = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(object, true);
  }
};

export const hashCircularObject = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(recursiveObject, true);
  }
};

export const hashRegExp = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(regex);
  }
};

export const hashSet = (cycles) => {
  let index = -1,
    val;

  while (++index < cycles) {
    val = hash(set, true);
  }
};
