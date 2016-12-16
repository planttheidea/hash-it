import test from 'ava';

import json from '../src/prune';

test.only('if prune handles recursive objects correctly', (t) => {
  const a = {
    foo: 'bar'
  };
  const b = {
    a
  };

  a.b = b;

  const expectedString = '{"foo":"bar","b":{"a":*Recursive-0}}';

  t.is(json.prune(a), expectedString);
});