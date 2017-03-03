// @flow

import { SafeString } from 'handlebars';

import sanitize from './sanitize';

describe('sanitize', () => {
  it('only allows `class` attributes on `div` elements', () => {
    expect(sanitize('<div class="divClass" id="content">Content</div>'))
      .toEqual(new SafeString('<div class="divClass">Content</div>'));
  });

  it('handles `undefined` as an empty string', () => {
    expect(sanitize(undefined))
      .toEqual(new SafeString(''));
  });
});
