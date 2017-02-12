import 'jquery';
/* global $ */
import 'backbone';
/* global Backbone */

import { parse } from 'url';

import { sign } from 'aws4';

import SwaggerUi from './swagger-ui-lib';
import AWS4AuthTemplate from './aws4_auth.handlebars';

function AWS4Authorization(service, type, keyId, key) {
  if (type !== 'header') {
    throw Error('Only header signatures supported');
  }

  this.service = service;
  this.keyId = keyId;
  this.key = key;
}

AWS4Authorization.prototype.apply = function apply(obj) {
  const url = parse(obj.url);
  const sig = sign({
    service: this.service,
    region: 'FR', // TODO Retrieve from obj or spec

    method: obj.method.toUpperCase(),
    hostname: url.hostname,
    port: url.port,
    path: url.path,

    body: obj.body,
    // TODO Any extra headers
  }, {
    accessKeyId: this.keyId,
    secretAccessKey: this.key,
  });

  /* TODO Copy (almost?) everything */
  if (sig.headers.Authorization) {
    // eslint-disable-next-line no-param-reassign
    obj.headers.Authorization = sig.headers.Authorization;
  }
  if (sig.headers['X-Amz-Date']) {
    // eslint-disable-next-line no-param-reassign
    obj.headers['X-Amz-Date'] = sig.headers['X-Amz-Date'];
  }

  return true;
};

function patchAuthView() {
  const orig = SwaggerUi.Views.AuthView.prototype.authorize;

  SwaggerUi.Views.AuthView.prototype.authorize = function authorize(...rest) {
    this.authsCollectionView.collection.forEach(function addClientAuthorization(auth) {
      const type = auth.get('type');

      if (type === 'x-aws4') {
        const aws4Auth = new AWS4Authorization(
          auth.get('x-service'), auth.get('x-in'), auth.get('keyId'), auth.get('key'));
        this.router.api.clientAuthorizations.add(auth.get('title'), aws4Auth);
      }
    }, this);

    return orig.call(this, ...rest);
  };
}

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

function patchAuthsCollection() {
  const orig = SwaggerUi.Collections.AuthsCollection.prototype.handleOne;

  SwaggerUi.Collections.AuthsCollection.prototype.handleOne = function handleOne(model, ...rest) {
    let result = null;

    if (!(model instanceof Backbone.Model)) {
      switch (model.type) {
        case 'x-aws4':
          result = new AWS4AuthModel(model);
          break;
        default:
          result = orig.call(this, model, ...rest);
          break;
      }
    }

    return result;
  };
}

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

function patchAuthsCollectionView() {
  const orig = SwaggerUi.Views.AuthsCollectionView.prototype.renderOneAuth;

  SwaggerUi.Views.AuthsCollectionView.prototype.renderOneAuth =
    function renderOneAuth(authModel, ...rest) {
      const type = authModel.get('type');

      if (type === 'x-aws4') {
        const authView = new AWS4AuthView({
          model: authModel,
          router: this.router,
        });
        const authViewEl = authView.render().el;
        this.authViews.push(authView);
        this.$innerEl.append(authViewEl);
      } else {
        orig.call(this, authModel, ...rest);
      }
    };
}

export default function () {
  patchAuthView();
  patchAuthsCollection();
  patchAuthsCollectionView();
}
