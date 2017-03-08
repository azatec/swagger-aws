// @flow

import { AWS4Authorization } from '.';

describe('AWS4Authorization', () => {
  it('has an `apply` function', () => {
    expect(AWS4Authorization.prototype.apply).toBeDefined();
  });
});
