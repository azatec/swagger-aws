// @flow

const Handlebars = require('handlebars');

module.exports = {
  process(src/* : string */) {
    return `
Handlebars.registerHelper('escape', require('../handlebars-helpers/escape').default);
Handlebars.registerHelper('sanitize', require('../handlebars-helpers/sanitize').default);
module.exports = Handlebars.template(${Handlebars.precompile(src)});`;
  },
};
