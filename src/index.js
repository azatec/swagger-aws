/* global $ */

import logo from 'swagger-ui/dist/images/logo_small.png';

import SwaggerUi from './swagger-ui-lib';
import patch from './patch';
import Chrome from './chrome.handlebars';

function main() {
  patch();

  $('body')
    .addClass('swagger-section')
    .append(Chrome({
      logo,
    }));

  const url = `http://${window.location.hostname}:9000/api/swagger.json`;

  /* global hljs */
  hljs.configure({
    highlightSizeThreshold: 5000,
  });

  const swaggerUi = new SwaggerUi({
    url,
    dom_id: 'swagger-ui-container',
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    docExpansion: 'full',
    jsonEditor: false,
    defaultModelRendering: 'schema',
    showRequestHeaders: false,
    showOperationIds: false,
  });

  swaggerUi.load();
}

$(main);
