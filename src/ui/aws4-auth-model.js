// @flow
import Backbone from 'backbone';

const AWS4AuthModel = Backbone.Model.extend({
  defaults: {
    'x-in': 'header',
    'x-service': null,
    keyId: null,
    key: null,
  },

  initialize: function initialize() {
    this.on('change', this.validate);
    this.validate();
  },

  validate: function validate() {
    const valid = !!this.get('x-service') && !!this.get('keyId') && !!this.get('key');
    this.set('valid', valid);
    return valid;
  },
});

export default AWS4AuthModel;
