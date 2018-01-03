/**
 * Created on 9/5/16.
 */
'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const faker = require('faker');

const dataArray = [];

const objectHash = require('object-hash');
const nodeObjectHash = require('node-object-hash')();
const hashObject = require('hash-object');
const hashIt = require('../lib').default;

let dataStairs = {end: 'is near'};

const Foo = function Foo(value) {
  this.value = value;

  return value;
};

console.log('Creating fake data...');

for (let i = 0; i < 50; i++) {
  dataArray.push({
    name: faker.name.firstName(),
    date: new Date(),
    address: {
      city: faker.address.city(),
      streetAddress: faker.address.streetAddress(),
      country: faker.address.country()
    },
    email: [faker.internet.email(), faker.internet.email(), faker.internet.email(), faker.internet.email()],
    randoms: [
      faker.random.number(),
      faker.random.alphaNumeric(),
      faker.random.number(),
      faker.random.alphaNumeric(),
      faker.random.words(),
      faker.random.word()
    ],
    avatars: [
      {
        number: faker.random.number(),
        avatar: faker.internet.avatar()
      },
      {
        number: faker.random.number(),
        avatar: faker.internet.avatar()
      },
      {
        number: faker.random.number(),
        avatar: faker.internet.avatar()
      },
      {
        number: faker.random.number(),
        avatar: faker.internet.avatar()
      }
    ]
  });
}

let tmp;

for (let i = 0; i < 100; i++) {
  tmp = {
    data: dataStairs
  };
  dataStairs = tmp;
}

// test preparations
const hashObjectOpts = {algorithm: 'sha256'};
const objectHashOpts = {
  algorithm: 'sha256',
  encoding: 'hex',
  unorderedArrays: true
};

// add tests
suite
  .add('hash-object', () => {
    hashObject(dataStairs, hashObjectOpts);
    hashObject(dataArray, hashObjectOpts);
  })
  .add('hash-it', () => {
    hashIt(dataStairs);
    hashIt(dataArray);
  })
  .add('node-object-hash', () => {
    nodeObjectHash.hash(dataStairs);
    nodeObjectHash.hash(dataArray);
  })
  .add('object-hash', () => {
    objectHash(dataStairs, objectHashOpts);
    objectHash(dataArray, objectHashOpts);
  })
  // add listeners
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    const fastest = this.filter('fastest').map('name');

    console.log(`Fastest is ${fastest}`);
  })
  // run async
  .run({async: true});
