export default {
  Login: (client) => {
    client
      .url(client.globals.url)
      .click('a.authorize__btn')
      .assert.visible('.api-popup-dialog')
      .setValue('input[name="keyId"]', 'theKeyId')
      .setValue('input[name="key"]', 'theKey')
      .useXpath()
        .click('(//button[@class="auth__button auth_submit__button"])[2]')
      .useCss();
  },
  'Try API call': (client) => {
    client
      .submitForm('form.sandbox')
      .waitForElementVisible('div.response_body', 1000)
      .assert.containsText('div.curl', 'AWS4-HMAC-SHA256')
      .assert.containsText('div.response_code', '200')
      .assert.containsText('div.response_body', 'YOUR NAME GOES HERE')
      .end();
  },
};
