import 'backbone';
/* global Backbone */
import 'jquery';
/* global $ */

import AWS4AuthTemplate from './aws4-auth-view.handlebars';

const AWS4AuthView = Backbone.View.extend({
  events: {
    'change .input_aws4_key_entry': 'inputChange',
    'change .input_aws4_keyId_entry': 'inputChange',
  },
  selectors: {
    aws4KeyInput: '.input_aws4_key_entry',
    aws4KeyIdInput: '.input_aws4_keyId_entry',
  },
  template: AWS4AuthTemplate,

  initialize: function initialize(opts) {
    this.options = opts || {};
    this.router = this.options.router;
  },

  render: function render() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  inputChange: function aws4KeyChange(e) {
    const $el = $(e.target);
    const val = $el.val();
    const name = $el.prop('name');

    if (val) {
      $el.removeClass('error');
    }

    this.model.set(name, val);
  },

  isValid: function isValid() {
    return this.model.validate();
  },

  highlightInvalid: function highlightInvalid() {
    if (!this.isValid()) {
      this.$(this.selectors.aws4KeyInput).addClass('error');
      this.$(this.selectors.aws4KeyIdInput).addClass('error');
    }
  },
});

export default AWS4AuthView;
