// @flow
import Backbone from 'backbone';
import SwaggerUi from 'swagger-ui';
import _ from 'lodash';

import { AWS4Authorization } from '../authorization';
import AWS4AuthModel from './aws4-auth-model';
import AWS4AuthView from './aws4-auth-view';

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

function patchAuthsCollection() {
  const origHandleOne = SwaggerUi.Collections.AuthsCollection.prototype.handleOne;

  SwaggerUi.Collections.AuthsCollection.prototype.handleOne = function handleOne(model, ...rest) {
    let result = null;

    if (!(model instanceof Backbone.Model)) {
      switch (model.type) {
        case 'x-aws4':
          result = new AWS4AuthModel(model);
          break;
        default:
          result = origHandleOne.call(this, model, ...rest);
          break;
      }
    }

    return result;
  };

  const origParse = SwaggerUi.Collections.AuthsCollection.prototype.parse;
  SwaggerUi.Collections.AuthsCollection.prototype.parse = function parse(data, ...rest) {
    const aws4 = {};
    const others = {};

    _.each(data, (value, key) => {
      if (value.type === 'x-aws4') {
        aws4[key] = value;
      } else {
        others[key] = value;
      }
    });

    const origResults = origParse.call(this, others, ...rest);

    let authz = {};
    if (typeof window.swaggerUi !== 'undefined') {
      authz = Object.assign({}, window.swaggerUi.api.clientAuthorizations.authz);
    }

    const aws4Results = _.map(aws4, (auth, name) => {
      _.extend(auth, {
        title: name,
      });

      if (authz[name]) {
        _.extend(auth, {
          isLogout: true,
          valid: true,
          keyId: authz[name].keyId,
          key: authz[name].key,
        });
      }

      return auth;
    });

    return [...origResults, ...aws4Results];
  };
}

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

// eslint-disable-next-line import/prefer-default-export
export function patch() {
  patchAuthView();
  patchAuthsCollection();
  patchAuthsCollectionView();
}
