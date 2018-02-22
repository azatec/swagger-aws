// @flow

/* Modified by Luca Tamnburo (luca.tamburo@azatec.com) */

import Backbone from 'backbone';

const AWS4AuthModel = Backbone.Model.extend({
  defaults: {
    'x-in': 'header',
    'x-service': 'execute-api',
    region: null,
    keyId: null,
    key: null,
    sessionToken: null,
  },

  initialize: function initialize() {
    this.on('change', this.validate);
    this.validate();
  },

  validate: function validate() {
    const valid = !!this.get('x-service') && !!this.get('region') && !!this.get('keyId') && !!this.get('key') && !!this.get('sessionToken');
    this.set('valid', valid);
    return valid;
  },
});

export default AWS4AuthModel;
