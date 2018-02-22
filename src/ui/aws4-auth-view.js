// @flow

/* Modified by Luca Tamnburo (luca.tamburo@azatec.com) */

import Backbone from 'backbone';
import $ from 'jquery';

// $FlowIgnore Loading this doesn't work
import AWS4AuthTemplate from './aws4-auth-view.handlebars';

const AWS4AuthView = Backbone.View.extend({
  events: {
    'change .select_aws4_region_entry': 'inputChange',
    'change .input_aws4_key_entry': 'inputChange',
    'change .input_aws4_keyId_entry': 'inputChange',
    'change .input_aws4_sessionToken_entry': 'inputChange',
  },
  selectors: {
    aws4RegionSelect: '.select_aws4_region_entry',
    aws4KeyInput: '.input_aws4_key_entry',
    aws4KeyIdInput: '.input_aws4_keyId_entry',
    aws4SessionTokenInput: '.input_aws4_sessionToken_entry',
  },
  template: AWS4AuthTemplate,

  render: function render() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  inputChange: function inputChange(e) {
    const $el = $(e.target);
    const val = $el.val();
    const name = $el.prop('name');

    /* istanbul ignore else: Nothing to test */
    if (val && val !== '') {
      $el.removeClass('error');
    }

    this.model.set({
      [name]: val,
    });
  },

  isValid: function isValid() {
    return this.model.validate();
  },

  highlightInvalid: function highlightInvalid() {
    if (this.$(this.selectors.aws4RegionSelect).val() === '') {
      this.$(this.selectors.aws4RegionSelect).addClass('error');
    } else {
      this.$(this.selectors.aws4RegionSelect).removeClass('error');
    }
    if (this.$(this.selectors.aws4KeyInput).val() === '') {
      this.$(this.selectors.aws4KeyInput).addClass('error');
    } else {
      this.$(this.selectors.aws4KeyInput).removeClass('error');
    }
    if (this.$(this.selectors.aws4KeyIdInput).val() === '') {
      this.$(this.selectors.aws4KeyIdInput).addClass('error');
    } else {
      this.$(this.selectors.aws4KeyIdInput).removeClass('error');
    }
    if (this.$(this.selectors.aws4SessionTokenInput).val() === '') {
      this.$(this.selectors.aws4SessionTokenInput).addClass('error');
    } else {
      this.$(this.selectors.aws4SessionTokenInput).removeClass('error');
    }

    if (this.isValid()) {
      this.$(this.selectors.aws4RegionSelect).removeClass('error');
      this.$(this.selectors.aws4KeyInput).removeClass('error');
      this.$(this.selectors.aws4KeyIdInput).removeClass('error');
      this.$(this.selectors.aws4SessionTokenInput).removeClass('error');
    }
  },
});

export default AWS4AuthView;
