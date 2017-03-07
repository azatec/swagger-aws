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
  basicLogin(username, password) {
    return this
      .assert.visible('@usernameInput')
      .assert.visible('@passwordInput')
      .assert.visible('@authorizeButton')

      .setValue('@usernameInput', username)
      .setValue('@passwordInput', password)
      .click('@basicAuthorizeButton');
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
    usernameInput: {
      selector: 'input[name="username"]',
    },
    passwordInput: {
      selector: 'input[name="password"]',
    },
    basicAuthorizeButton: {
      selector: '(//button[@class="auth__button auth_submit__button"])[1]',
      locateStrategy: 'xpath',
    },
    cancelButton: {
      selector: '.api-popup-cancel',
    },
  },
};
