import logo from 'swagger-ui/dist/images/logo_small.png';

import SwaggerUi from './swagger-ui-lib';
import patch from './patch';
import Chrome from './chrome.handlebars';

require('swagger-ui/dist/lib/jquery-1.8.0.min.js');
/* global $ */
require('swagger-ui/dist/lib/highlight.9.1.0.pack.js');
/* global hljs */

function main() {
  patch();

  $('body')
    .addClass('swagger-section')
    .append(Chrome({
      logo,
    }));

  const url = `http://${window.location.hostname}:9000/api/swagger.json`;

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
