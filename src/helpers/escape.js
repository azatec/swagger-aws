import Handlebars from 'handlebars/runtime';

export default function escape(value) {
  const text = Handlebars.Utils.escapeExpression(value);
  return new Handlebars.SafeString(text);
}
