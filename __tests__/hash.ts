import hash from '../src/hash';

describe('hash', () => {
  it('should have return the correct value', () => {
    const string = 'foo';

    expect(hash(string)).toBe(794144147649);
  });
});
