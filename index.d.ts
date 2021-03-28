/* eslint-disable */

interface SingleCompare {
  (basis: any, value: any): boolean;
}

interface Compare {
  (basis: any, ...values: any[]): boolean;
}

interface Is extends SingleCompare {
  all: Compare;
  any: Compare;
  not: SingleCompare;
}

interface HashIt {
  <Value extends any>(value: Value): number;

  is: Is;
}

declare const hash: HashIt;

export default hash;
