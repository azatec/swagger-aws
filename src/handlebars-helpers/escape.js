// @flow
import Handlebars from 'handlebars/runtime';

export default function escape(value: string) {
  const text = Handlebars.Utils.escapeExpression(value);
  return new Handlebars.SafeString(text);
}
