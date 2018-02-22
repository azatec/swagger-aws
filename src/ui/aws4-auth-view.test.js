// @flow

/* Modified by Luca Tamnburo (luca.tamburo@azatec.com) */

import AWS4AuthModel from './aws4-auth-model';
import AWS4AuthView from './aws4-auth-view';

describe('AWS4AuthView', () => {
  it('should not regress', () => {
    const model = new AWS4AuthModel({
      'x-in': 'header',
      'x-service': 'tests',
      region: 'be-west-1',
    });
    const view = new AWS4AuthView({ model });
    expect(view.render().$el.html()).toMatchSnapshot();
  });

  it('highlights invalid fields', () => {
    const model = new AWS4AuthModel({
      'x-in': 'header',
      'x-service': 'tests',
      region: 'uk-central-1',
    });
    const view = new AWS4AuthView({ model }).render();

    expect(view.$('.select_aws4_region_entry').hasClass('error')).toBe(false);
    expect(view.$('.input_aws4_keyId_entry').hasClass('error')).toBe(false);
    expect(view.$('.input_aws4_key_entry').hasClass('error')).toBe(false);
    expect(view.$('.input_aws4_sessionToken_entry').hasClass('error')).toBe(false);


    expect(view.isValid()).toBe(false);
    view.highlightInvalid();
    expect(view.$('.select_aws4_region_entry').hasClass('error')).toBe(true);
    expect(view.$('.input_aws4_keyId_entry').hasClass('error')).toBe(true);
    expect(view.$('.input_aws4_key_entry').hasClass('error')).toBe(true);
    expect(view.$('.input_aws4_sessionToken_entry').hasClass('error')).toBe(true);

    model.set('region', 'theRegion');
    model.set('keyId', 'theKeyId');
    model.set('key', 'theKey');
    model.set('sessionToken', 'theSessionToken');

    expect(view.isValid()).toBe(true);
  });

  /* This currently doesn't work... Neither does it in the standard SwaggerUI
   * components */
  it('removes highlighting of invalid fields after input entered', () => {
    const model = new AWS4AuthModel({
      'x-service': 'tests',
    });
    const view = new AWS4AuthView({ model }).render();

    view.highlightInvalid();
    expect(view.$('.select_aws4_region_entry').hasClass('error')).toBe(true);
    expect(view.$('.input_aws4_keyId_entry').hasClass('error')).toBe(true);
    expect(view.$('.input_aws4_key_entry').hasClass('error')).toBe(true);
    expect(view.$('.input_aws4_sessionToken_entry').hasClass('error')).toBe(true);

    model.set({
      region: 'eu-west-1',
      keyId: 'theKeyId',
      key: 'theKey',
      sessionToken: 'theSessionToken',
    });

    view.highlightInvalid();
    expect(view.$('.select_aws4_region_entry').hasClass('error')).toBe(false);
    expect(view.$('.input_aws4_keyId_entry').hasClass('error')).toBe(false);
    expect(view.$('.input_aws4_key_entry').hasClass('error')).toBe(false);
    expect(view.$('.input_aws4_sessionToken_entry').hasClass('error')).toBe(false);
  });

  ['keyId', 'key', 'sessionToken'].forEach((fieldName) => {
    it(`reacts on change events of the '${fieldName}' input field`, () => {
      const model = new AWS4AuthModel({
        'x-service': 'tests',
      });
      const view = new AWS4AuthView({ model }).render();
      const input = view.$(`.input_aws4_${fieldName}_entry`);

      view.highlightInvalid();
      expect(input.hasClass('error')).toBe(true);

      const value = `the${fieldName.replace(/^k/, 'K')}`;

      input.val(value);
      /* For some reason, this doesn't get triggered automatically, whilst it
       * is in a browser
       */
      view.inputChange({
        target: input,
      });

      expect(input.hasClass('error')).toBe(false);
      expect(model.get(fieldName)).toBe(value);
    });
  });

  it('reacts on change events of the `region` select field', () => {
    const model = new AWS4AuthModel({
      'x-service': 'tests',
    });
    const view = new AWS4AuthView({ model }).render();
    const input = view.$('.select_aws4_region_entry');

    view.highlightInvalid();
    expect(input.hasClass('error')).toBe(true);

    const value = 'eu-west-1';

    input.val(value);
    /* For some reason, this doesn't get triggered automatically, whilst it
     * is in a browser
     */
    view.inputChange({
      target: input,
    });

    expect(input.hasClass('error')).toBe(false);
    expect(model.get('region')).toBe(value);
  });

  it('doesn\'t highlight valid fields', () => {
    const view = new AWS4AuthView({
      model: new AWS4AuthModel({
        'x-service': 'tests',
      }),
    }).render();

    const regionField = view.$('.select_aws4_region_entry');
    const keyIdField = view.$('.input_aws4_keyId_entry');
    const keyField = view.$('.input_aws4_key_entry');
    const sessionTokenField = view.$('.input_aws4_sessionToken_entry');

    regionField.val('eu-west-1');
    keyIdField.val('theKeyId');
    keyField.val('theKey');
    sessionTokenField.val('theSessionToken');

    view.inputChange({
      target: regionField,
    });
    view.inputChange({
      target: keyIdField,
    });
    view.inputChange({
      target: keyField,
    });
    view.inputChange({
      target: sessionTokenField,
    });

    view.highlightInvalid();

    expect(regionField.hasClass('error')).toBe(false);
    expect(keyIdField.hasClass('error')).toBe(false);
    expect(keyField.hasClass('error')).toBe(false);
    expect(sessionTokenField.hasClass('error')).toBe(false);
  });
});
