/* eslint-disable */

interface CurriedCompare {
  (valueBasis: any, ...values: any[]): boolean;
  (valueBasis: any): (...values: any[]) => boolean;
}

interface Is extends CurriedCompare {
  all: CurriedCompare;
  any: CurriedCompare;
  not: CurriedCompare;
}

interface HashIt {
  <Value extends any>(value: Value): number;

  is: Is;
}

declare const hash: HashIt;

export default hash;
