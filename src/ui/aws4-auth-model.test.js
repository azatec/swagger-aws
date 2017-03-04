import AWS4AuthModel from './aws4-auth-model';

describe('AWS4AuthModel', () => {
  it('defaults to `header` for the `x-in` field', () => {
    expect(new AWS4AuthModel().get('x-in')).toBe('header');
  });

  it('has no defaults for `x-service`, `keyId` and `key`', () => {
    expect(new AWS4AuthModel().get('x-service')).toBeNull();
    expect(new AWS4AuthModel().get('x-region')).toBeNull();
    expect(new AWS4AuthModel().get('keyId')).toBeNull();
    expect(new AWS4AuthModel().get('key')).toBeNull();
  });

  it('is invalid after construction', () => {
    expect(new AWS4AuthModel().get('valid')).toBe(false);
    expect(new AWS4AuthModel().validate()).toBe(false);
  });

  it('is invalid after partial construction', () => {
    const model1 = new AWS4AuthModel({
      'x-service': 'tests',
    });
    model1.set('keyId', 'theKeyId');

    expect(model1.get('valid')).toBe(false);
    expect(model1.validate()).toBe(false);

    const model2 = new AWS4AuthModel({
      'x-service': 'tests',
    });
    model2.set('key', 'theKey');

    expect(model2.get('valid')).toBe(false);
    expect(model2.validate()).toBe(false);
  });

  it('is valid after full construction', () => {
    const model = new AWS4AuthModel({
      'x-service': 'tests',
      'x-region': 'eu-east-1',
    });

    model.set('keyId', 'theKeyId');
    model.set('key', 'theKey');

    expect(model.get('valid')).toBe(true);
    expect(model.validate()).toBe(true);
  });
});
