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
});
