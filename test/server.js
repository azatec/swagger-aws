/* eslint-disable no-console */

import * as path from 'path';
import * as url from 'url';
import * as express from 'express';

const app = express.default();
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Authorization, X-Amz-Date');
  next();
});

app.get('/api/swagger.json', (req, res) => {
  const swagger = require('./swagger.json'); // eslint-disable-line global-require
  if (typeof app.serverUrl !== 'undefined') {
    const serverUrl = url.parse(app.serverUrl);
    swagger.host = serverUrl.host;
    swagger.basePath = `${serverUrl.pathname}api`;
  }
  res.json(swagger);
});

app.get('/api/account', (req, res) => {
  if (typeof req.get('Authorization') === 'undefined') {
    console.log('Missing authorization');
    res.status(401).json({
      code: 401,
      message: 'No authorization provided',
    });
  } else {
    const auth = req.get('Authorization');
    console.log(`Successful request: ${auth}`);

    const handleBasicAuth = () => {
      const val = req.get('Authorization').split(/ /)[1];
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

app.use(express.static(path.resolve(__dirname, '../dist')));

export default app;
