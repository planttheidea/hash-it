import Benchmark from 'benchmark';
import { faker } from '@faker-js/faker';
import objectHash from 'object-hash';
import createNodeObjectHash from 'node-object-hash';
import hashObject from 'hash-object';
import hash from '../dist/esm/index.mjs';

const nodeObjectHash = createNodeObjectHash();
const suite = new Benchmark.Suite();
const dataArray = [];

let dataStairs = { end: 'is near' };

console.log('Creating fake data...');

for (let i = 0; i < 50; i++) {
  dataArray.push({
    name: faker.name.firstName(),
    date: new Date(),
    address: {
      city: faker.address.city(),
      streetAddress: faker.address.streetAddress(),
      country: faker.address.country(),
    },
    email: [
      faker.internet.email(),
      faker.internet.email(),
      faker.internet.email(),
      faker.internet.email(),
    ],
    randoms: [
      faker.datatype.number(),
      faker.random.alphaNumeric(),
      faker.datatype.number(),
      faker.random.alphaNumeric(),
      faker.random.words(),
      faker.random.word(),
    ],
    avatars: [
      {
        number: faker.datatype.number(),
        avatar: faker.internet.avatar(),
      },
      {
        number: faker.datatype.number(),
        avatar: faker.internet.avatar(),
      },
      {
        number: faker.datatype.number(),
        avatar: faker.internet.avatar(),
      },
      {
        number: faker.datatype.number(),
        avatar: faker.internet.avatar(),
      },
    ],
  });
}

let tmp;

for (let i = 0; i < 100; i++) {
  tmp = {
    data: dataStairs,
  };
  dataStairs = tmp;
}

// test preparations
const hashObjectOpts = { algorithm: 'sha256' };
const objectHashOpts = {
  algorithm: 'sha256',
  encoding: 'hex',
  unorderedArrays: true,
};

console.log('Running benchmarks...');

// add tests
suite
  .add('hash-object', () => {
    hashObject(dataStairs, hashObjectOpts);
    hashObject(dataArray, hashObjectOpts);
  })
  .add('hash-it', () => {
    hash(dataStairs);
    hash(dataArray);
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
  .on('complete', function () {
    const fastest = this.filter('fastest').map('name');

    console.log(`Fastest is ${fastest}`);
  })
  // run async
  .run({ async: true });
