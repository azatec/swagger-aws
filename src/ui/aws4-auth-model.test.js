// @flow

/* Modified by Luca Tamnburo (luca.tamburo@azatec.com) */

import AWS4AuthModel from './aws4-auth-model';

describe('AWS4AuthModel', () => {
  it('defaults to `header` for the `x-in` field', () => {
    expect(new AWS4AuthModel().get('x-in')).toBe('header');
  });

  it('defaults to `execute-api` for the `x-service` field', () => {
    expect(new AWS4AuthModel().get('x-service')).toBe('execute-api');
  });

  it('has no defaults for `region`, `keyId` and `key`', () => {
    expect(new AWS4AuthModel().get('region')).toBeNull();
    expect(new AWS4AuthModel().get('keyId')).toBeNull();
    expect(new AWS4AuthModel().get('key')).toBeNull();
    expect(new AWS4AuthModel().get('sessionToken')).toBeNull();
  });

  it('is invalid after construction', () => {
    expect(new AWS4AuthModel().get('valid')).toBe(false);
    expect(new AWS4AuthModel().validate()).toBe(false);
  });

  it('is invalid after partial construction', () => {
    const model1 = new AWS4AuthModel({
      'x-service': 'tests',
    });
    model1.set('region', 'theRegion');

    expect(model1.get('valid')).toBe(false);
    expect(model1.validate()).toBe(false);

    const model2 = new AWS4AuthModel({
      'x-service': 'tests',
    });
    model2.set('keyId', 'theKeyId');

    expect(model2.get('valid')).toBe(false);
    expect(model2.validate()).toBe(false);

    const model3 = new AWS4AuthModel({
      'x-service': 'tests',
    });
    model3.set('key', 'theKey');

    expect(model3.get('valid')).toBe(false);
    expect(model3.validate()).toBe(false);


    const model4 = new AWS4AuthModel({
      'x-service': 'tests',
    });
    model4.set('sessionToken', 'theSessionToken');

    expect(model4.get('valid')).toBe(false);
    expect(model4.validate()).toBe(false);
  });

  it('is valid after full construction', () => {
    const model = new AWS4AuthModel({
      region: 'eu-east-1',
    });

    model.set('keyId', 'theKeyId');
    model.set('key', 'theKey');
    model.set('sessionToken', 'theSessionToken');

    expect(model.get('valid')).toBe(true);
    expect(model.validate()).toBe(true);
  });
});
