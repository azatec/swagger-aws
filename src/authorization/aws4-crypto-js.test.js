// @flow
import { createHash, createHmac } from './aws4-crypto-js';

describe('createHmac', () => {
  it('should generate correct HMACs using the `crypto` interface', () => {
    const message = 'abcde';
    const key = 'secret';
    const result = '0390842fc46597654c6fc20eea5d2cf8a9d009de1bac83ba09bfa62cc64ba015';

    expect(createHmac('sha256', key).update(message, 'utf8').digest()).toBe(result);
  });
});

describe('createHash', () => {
  it('should generate correct hashes using the `crypto` interface', () => {
    const message = 'abcde';
    const result = '36bbe50ed96841d10443bcb670d6554f0a34b761be67ec9c4a8ad2c0c44ca42c';

    expect(createHash('sha256').update(message, 'utf8').digest()).toBe(result);
  });
});
