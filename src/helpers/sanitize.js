/* global Handlebars */
/* global sanitizeHtml */

/* Taken (and ES2015'ed) from SwaggerUI */
export default function sanitize(text) {
  return new Handlebars.SafeString(
    sanitizeHtml(
      text === undefined ? '' : text,
      {
        allowedTags: [
          'div', 'span', 'b', 'i', 'em', 'strong', 'a', 'br', 'table', 'tbody', 'tr', 'th', 'td',
        ],
        allowedAttributes: {
          div: ['class'],
          span: ['class'],
          table: ['class'],
          td: ['class'],
          th: ['colspan'],
          a: ['href'],
        },
      }));
}
