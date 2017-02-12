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
  const sig = sign({
    service: this.service,
    region: 'FR', // TODO Retrieve from obj or spec

    method: obj.method.toUpperCase(),
    hostname: url.hostname,
    port: url.port,
    path: url.path,

    body: obj.body,
    // TODO Any extra headers
  }, {
    accessKeyId: this.keyId,
    secretAccessKey: this.key,
  });

  /* TODO Copy (almost?) everything */
  if (sig.headers.Authorization) {
    // eslint-disable-next-line no-param-reassign
    obj.headers.Authorization = sig.headers.Authorization;
  }
  if (sig.headers['X-Amz-Date']) {
    // eslint-disable-next-line no-param-reassign
    obj.headers['X-Amz-Date'] = sig.headers['X-Amz-Date'];
  }

  return true;
};

export default AWS4Authorization;
