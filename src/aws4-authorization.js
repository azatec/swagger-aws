import { sign } from 'aws4';
import { parse } from 'url';

function AWS4Authorization(service, type, keyId, key) {
  if (type !== 'header') {
    throw Error('Only header signatures supported');
  }

  this.service = service;
  this.keyId = keyId;
  this.key = key;
}

AWS4Authorization.prototype.apply = function apply(obj) {
  const url = parse(obj.url);

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

  return true;
};

export default AWS4Authorization;
