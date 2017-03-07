// @flow

import { algo, enc } from 'crypto-js/core';
import 'crypto-js/enc-hex';
import 'crypto-js/enc-utf8';
import 'crypto-js/hmac';
import 'crypto-js/sha256';

type HashResult = {
  toString(encoder: ?any): string;
};

type HashState = {
  update(data: string): void;
  finalize(): HashResult;
}

class HashInterface {
  state: HashState;

  constructor(state: HashState) {
    this.state = state;
  }

  update(string: string, encoding: ?string) {
    if (typeof encoding !== 'undefined' && encoding !== null && encoding !== 'utf8') {
      throw new Error(`Unsupported encoding: ${encoding}`);
    }

    this.state.update(enc.Utf8.parse(string));

    return this;
  }

  digest(encoding: ?string) {
    if (typeof encoding !== 'undefined' && encoding !== null && encoding !== 'hex') {
      throw new Error(`Unsupported encoding: ${encoding}`);
    }

    return this.state.finalize().toString(enc.Hex);
  }
}

export function createHmac(algorithm: string, key: string): HashInterface {
  if (algorithm !== 'sha256') {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  return new HashInterface(algo.HMAC.create(algo.SHA256, key));
}

export function createHash(algorithm: string): HashInterface {
  if (algorithm !== 'sha256') {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  return new HashInterface(algo.SHA256.create());
}
