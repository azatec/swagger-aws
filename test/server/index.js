// @flow
/* eslint-disable no-console, strict */

/* Modified by Luca Tamnburo (luca.tamburo@azatec.com) */

'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');

const pkg = require('../../package.json');
const swagger = require('./swagger.json');

const scriptLine = "<script src='swagger-ui.js' type='text/javascript'></script>";
const baseUrl = 'http://petstore.swagger.io/v2/swagger.json';

const index = fs.readFileSync(
  path.resolve(__dirname, '../../node_modules/swagger-ui/dist/index.html'))
  .toString();

if (index.search(scriptLine) === -1
    || index.search(baseUrl) === -1) {
  throw new Error('Unexpected index.html source');
}

const patchedIndex = index.replace(
  scriptLine, [
    scriptLine,
    `<script src='SwaggerAws.Authorization-${pkg.version}.min.js' type='text/javascript'></script>`,
    `<script src='SwaggerAws.Ui-${pkg.version}.min.js' type='text/javascript'></script>`,
    "<script type='text/javascript'>",
    'SwaggerAws.Ui.patch();',
    '</script>',
  ].join('\n'))
  .replace(baseUrl, '/api/swagger.json');

/* :: type Options = {
  serveDist: boolean,
};
*/

module.exports = function setupApp(app/* : express$Application  */, options/* : Options */) {
  options = options || {}; // eslint-disable-line no-param-reassign

  const serveDist = typeof options.serveDist === 'undefined' ? true : options.serveDist;

  app.use(
    (req/* : express$Request */, res/* : express$Response */, next/* : express$NextFunction */) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Headers', 'Authorization, X-Amz-Date');
      next();
    });

  app.get('/api/swagger.json', (req/* : express$Request */, res/* : express$Response */) => {
    res.json(swagger);
  });

  app.get('/api/account', (req/* : express$Request */, res/* : express$Response */) => {
    const auth = req.get('Authorization');

    if (typeof auth === 'undefined') {
      console.log('Missing authorization');
      res.status(401).json({
        code: 401,
        message: 'No authorization provided',
      });
    } else {
      console.log(`Successful request: ${auth}`);

      const handleBasicAuth = () => {
        const val = auth.split(/ /)[1];
        const orig = Buffer.from(val, 'base64').toString();
        return orig.split(':')[0];
      };

      const handleAWS4Auth = () => {
        if (typeof req.get('X-Amz-Date') === 'undefined') {
          return null;
        }
      // TODO Implement this. If I ever feel like it...
        return 'YOUR NAME GOES HERE';
      };

      let name = null;
      const type = auth.split(/ /)[0];
      switch (type) {
        case 'Basic':
          name = handleBasicAuth();
          break;
        case 'AWS4-HMAC-SHA256':
          name = handleAWS4Auth();
          break;
        default:
          console.log('Unknown authorization scheme');
          break;
      }

      if (name === null) {
        res.status(401).json({
          code: 401,
          message: 'Authentication failed',
        });
      } else {
        res.json({
          name,
        });
      }
    }
  });

  app.get('/', (req/* : express$Request */, res/* : express$Response */) => {
    res.set('Content-Type', 'text/html');
    res.send(patchedIndex);
  });

  if (serveDist) {
    app.use(express.static(path.resolve(__dirname, '../../dist')));
  }
  app.use(express.static(path.resolve(__dirname, '../../node_modules/swagger-ui/dist')));

  return app;
};
