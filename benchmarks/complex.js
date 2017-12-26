'use strict';

const hashIt = require('../lib').default;
const {boolean, infinite, notANumber, nul, number, string, undef} = require('./primitive');

const array = [boolean, infinite, notANumber, nul, number, string, undef];
const object = {
  boolean,
  infinite,
  notANumber,
  nul,
  number,
  string,
  undef
};
const func = function(foo, bar) {};
const map = new Map([['foo', 'bar'], ['bar', 'baz']]);
const regex = /foo/;
const set = new Set(['foo', 'bar', 'baz']);
const recursiveObject = (() => {
  function Circular() {
    this.circular = this;
  }

  return new Circular();
})();

exports.hashArray = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hashIt(array);
  }
};

exports.hashFunction = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hashIt(func);
  }
};

exports.hashMap = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hashIt(map);
  }
};

exports.hashObject = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hashIt(object);
  }
};

exports.hashCircularObject = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hashIt(recursiveObject, true);
  }
};

exports.hashRegExp = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hashIt(regex);
  }
};

exports.hashSet = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hashIt(set);
  }
};
