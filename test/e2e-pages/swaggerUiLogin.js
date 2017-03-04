const loginCommands = {
  openDialog() {
    return this
      .waitForElementVisible('@authorizeDialogButton')

      .click('@authorizeDialogButton')
      .waitForElementVisible('@authorizeDialog');
  },
  login(keyId, key) {
    return this
      .assert.visible('@keyIdInput')
      .assert.visible('@keyInput')
      .assert.visible('@authorizeButton')

      .setValue('@keyIdInput', keyId)
      .setValue('@keyInput', key)
      .click('@authorizeButton');
  },
  closeDialog() {
    return this
      .assert.visible('@cancelButton')
      .click('@cancelButton');
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
    cancelButton: {
      selector: '.api-popup-cancel',
    },
  },
};
