import 'handlebars';
/* global Handlebars */

export default function escape(value) {
  const text = Handlebars.Utils.escapeExpression(value);
  return new Handlebars.SafeString(text);
}
