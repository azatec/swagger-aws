/* global $ */

import logo from 'swagger-ui/dist/images/logo_small.png';

import SwaggerUi from './swagger-ui-lib';
import Chrome from './chrome.handlebars';

function main() {
  $('body')
    .addClass('swagger-section')
    .append(Chrome({
      logo,
    }));

  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = 'http://petstore.swagger.io/v2/swagger.json';
  }

  /* global hljs */
  hljs.configure({
    highlightSizeThreshold: 5000,
  });

  const swaggerUi = new SwaggerUi({
    url,
    dom_id: 'swagger-ui-container',
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    docExpansion: 'none',
    jsonEditor: false,
    defaultModelRendering: 'schema',
    showRequestHeaders: false,
    showOperationIds: false,
  });

  swaggerUi.load();
}

$(main);
