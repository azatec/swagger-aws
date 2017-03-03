// @flow

import { algo, enc } from 'crypto-js/core';
import 'crypto-js/enc-hex';
import 'crypto-js/enc-utf8';
import 'crypto-js/hmac';
import 'crypto-js/sha256';

class Hmac {
  constructor(hasher, key) {
    this.hmac = algo.HMAC.create(hasher, key);
  }

  update(string, encoding) {
    if (encoding !== 'utf8') {
      throw new Error(`Unsupported encoding: ${encoding}`);
    }

    this.hmac.update(enc.Utf8.parse(string));

    return this;
  }

  digest(encoding) {
    if (typeof encoding !== 'undefined' && encoding !== 'hex') {
      throw new Error(`Unsupported encoding: ${encoding}`);
    }

    return this.hmac.finalize().toString(enc.Hex);
  }
}

export function createHmac(alg, key) {
  if (alg !== 'sha256') {
    throw new Error(`Unsupported algorithm: ${alg}`);
  }

  return new Hmac(algo.SHA256, key);
}


class Hash {
  constructor(hasher) {
    this.hasher = hasher.create();
  }

  update(string, encoding) {
    if (encoding !== 'utf8') {
      throw new Error(`Unsupported encoding: ${encoding}`);
    }

    this.hasher.update(enc.Utf8.parse(string));

    return this;
  }

  digest(encoding) {
    if (typeof encoding !== 'undefined' && encoding !== 'hex') {
      throw new Error(`Unsupported encoding: ${encoding}`);
    }

    return this.hasher.finalize().toString(enc.Hex);
  }
}

export function createHash(alg) {
  if (alg !== 'sha256') {
    throw new Error(`Unsupported algorithm: ${alg}`);
  }

  return new Hash(algo.SHA256);
}
