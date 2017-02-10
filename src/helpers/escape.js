require('swagger-ui/dist/lib/handlebars-4.0.5.js');
/* global Handlebars */

export default function escape(value) {
  const text = Handlebars.Utils.escapeExpression(value);
  return new Handlebars.SafeString(text);
}
