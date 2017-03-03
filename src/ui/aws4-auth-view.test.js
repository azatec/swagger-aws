// @flow
import AWS4AuthModel from './aws4-auth-model';
import AWS4AuthView from './aws4-auth-view';

describe('AWS4AuthView', () => {
  it('should not regress', () => {
    const model = new AWS4AuthModel({
      'x-in': 'header',
      'x-service': 'tests',
    });
    const view = new AWS4AuthView({ model });
    expect(view.render().$el.html()).toMatchSnapshot();
  });

  it('highlights invalid fields', () => {
    const model = new AWS4AuthModel({
      'x-in': 'header',
      'x-service': 'tests',
    });
    const view = new AWS4AuthView({ model }).render();

    expect(view.$('.input_aws4_keyId_entry').hasClass('error')).toBe(false);
    expect(view.$('.input_aws4_key_entry').hasClass('error')).toBe(false);

    expect(view.isValid()).toBe(false);
    view.highlightInvalid();
    expect(view.$('.input_aws4_keyId_entry').hasClass('error')).toBe(true);
    expect(view.$('.input_aws4_key_entry').hasClass('error')).toBe(true);

    model.set('keyId', 'theKeyId');
    model.set('key', 'theKey');
    expect(view.isValid()).toBe(true);
  });

  /* This currently doesn't work... Neither does it in the standard SwaggerUI
   * components */
  xit('removes highlighting of invalid fields after input entered', () => {
    const model = new AWS4AuthModel({
      'x-service': 'tests',
    });
    const view = new AWS4AuthView({ model }).render();

    view.highlightInvalid();
    expect(view.$('.input_aws4_keyId_entry').hasClass('error')).toBe(true);
    expect(view.$('.input_aws4_key_entry').hasClass('error')).toBe(true);

    model.set({
      keyId: 'theKeyId',
      key: 'theKey',
    });

    view.highlightInvalid();
    expect(view.$('.input_aws4_keyId_entry').hasClass('error')).toBe(false);
    expect(view.$('.input_aws4_key_entry').hasClass('error')).toBe(false);
  });

  ['keyId', 'key'].forEach((fieldName) => {
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

  it('doesn\'t highlight valid fields', () => {
    const view = new AWS4AuthView({
      model: new AWS4AuthModel({
        'x-service': 'tests',
      }),
    }).render();
    const keyIdField = view.$('.input_aws4_keyId_entry');
    const keyField = view.$('.input_aws4_key_entry');

    keyIdField.val('theKeyId');
    keyField.val('theKey');

    view.inputChange({
      target: keyIdField,
    });
    view.inputChange({
      target: keyField,
    });

    view.highlightInvalid();

    expect(keyIdField.hasClass('error')).toBe(false);
    expect(keyField.hasClass('error')).toBe(false);
  });
});
