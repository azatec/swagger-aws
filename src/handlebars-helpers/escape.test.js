// @flow
import { SafeString } from 'handlebars';

import escape from './escape';

describe('escape', () => {
  it('escapes HTML', () => {
    expect(escape('<script>alert("Injected!");</script>')).toEqual(
      new SafeString(
        '&lt;script&gt;alert(&quot;Injected!&quot;);&lt;/script&gt;'));
  });
});
