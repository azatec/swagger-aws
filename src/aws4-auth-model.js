import 'backbone';
/* global Backbone */

const AWS4AuthModel = Backbone.Model.extend({
  default: {
    'x-in': 'header',
    'x-service': '',
    keyId: '',
    key: '',
  },

  initialize: function initialize() {
    this.on('change', this.validate);
  },

  validate: function validate() {
    const valid = !!this.get('x-service') && !!this.get('keyId') && !!this.get('key');
    this.set('valid', valid);
    return valid;
  },
});

export default AWS4AuthModel;
