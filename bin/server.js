// eslint-disable-next-line import/no-extraneous-dependencies
require('babel-core/register');

const app = require('../test/server.js').default;

app.listen(9000, () => {
  // eslint-disable-next-line no-console
  console.log('Application listening on port 9000');
});
