const loginCommands = {
  login(keyId, key) {
    return this
      .waitForElementVisible('@authorizeDialogButton')

      .click('@authorizeDialogButton')
      .waitForElementVisible('@authorizeDialog')

      .assert.visible('@keyIdInput')
      .assert.visible('@keyInput')
      .assert.visible('@authorizeButton')

      .setValue('@keyIdInput', keyId)
      .setValue('@keyInput', key)
      .click('@authorizeButton');
  },
};

module.exports = {
  commands: [loginCommands],
  elements: {
    authorizeDialogButton: {
      selector: 'a.authorize__btn',
    },
    authorizeDialog: {
      selector: '.api-popup-dialog',
    },
    keyIdInput: {
      selector: 'input[name="keyId"]',
    },
    keyInput: {
      selector: 'input[name="key"]',
    },
    authorizeButton: {
      selector: '(//button[@class="auth__button auth_submit__button"])[2]',
      locateStrategy: 'xpath',
    },
  },
};
