const getAccountCommands = {
  expandGetAccount() {
    return this
      .click('.expandResource')
      .waitForElementVisible('@form');
  },

  getAccount() {
    return this
      .waitForElementVisible('@form')
      .submitForm('@form')
      .waitForElementVisible('@responseBody');
  },
};

module.exports = {
  commands: [getAccountCommands],
  elements: {
    form: {
      selector: '#Account_get_account form.sandbox',
    },
    responseBody: {
      selector: '#Account_get_account div.response_body',
    },
    curl: {
      selector: '#Account_get_account div.curl',
    },
    responseCode: {
      selector: '#Account_get_account div.response_code',
    },
  },
};
