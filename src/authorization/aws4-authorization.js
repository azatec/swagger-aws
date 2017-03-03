// @flow

import { sign } from 'aws4';
import { parse } from 'url';

type Request = {
  url: string,
  method: string,
  headers: { [key: string]: string },
  body?: string,
};

export default class AWS4AAuthorization {
  service: string;
  keyId: string;
  key: string;

  constructor(service: string, type: 'header', keyId: string, key: string) {
    if (type !== 'header') {
      throw Error('Only header signatures supported');
    }

    this.service = service;
    this.keyId = keyId;
    this.key = key;
  }

  apply(obj: Request) {
    const url = parse(obj.url);

    const origHost = obj.headers.Host;

    /* By passing `obj.headers` as the `headers` value in the object passed to
     * `sign`, all required headers will be set in-place.
     */
    sign({
      service: this.service,
      region: 'FR', // TODO Retrieve from obj or spec

      method: obj.method.toUpperCase(),
      hostname: url.hostname,
      port: url.port,
      path: url.path,

      headers: obj.headers,
      body: obj.body,
    }, {
      accessKeyId: this.keyId,
      secretAccessKey: this.key,
    });

    delete obj.headers.Host; // eslint-disable-line no-param-reassign
    if (typeof origHost !== 'undefined') {
      obj.headers.Host = origHost; // eslint-disable-line no-param-reassign
    }

    return true;
  }
}
