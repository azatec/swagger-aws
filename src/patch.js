import 'backbone';
/* global Backbone */

import SwaggerUi from './swagger-ui-lib';
import AWS4Authorization from './aws4-authorization';
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
