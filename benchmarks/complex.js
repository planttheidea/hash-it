'use strict';

const hash = require('../lib').default;
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
  function Circular(value) {
    this.deeply = {
      nested: {
        reference: this,
        value
      }
    };
  }

  return new Circular();
})();

exports.hashArray = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hash(array, true);
  }
};

exports.hashFunction = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hash(func, true);
  }
};

exports.hashMap = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hash(map, true);
  }
};

exports.hashObject = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hash(object, true);
  }
};

exports.hashCircularObject = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hash(recursiveObject, true);
  }
};

exports.hashRegExp = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hash(regex);
  }
};

exports.hashSet = (cycles) => {
  let index = -1,
      val;

  while (++index < cycles) {
    val = hash(set, true);
  }
};
