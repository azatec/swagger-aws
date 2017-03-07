import { afterScenario } from '../globals';

module.exports = {
  after: afterScenario,

  'Check both fields get highlighted when empty': (client) => {
    client
      .url(client.launchUrl ? client.launchUrl : client.globals.launchUrl);

    const loginPage = client.page.swaggerUiLogin();

    loginPage
      .openDialog()
      .click('@authorizeButton')
      .assert.cssClassPresent('@keyIdInput', 'error')
      .assert.cssClassPresent('@keyInput', 'error');
  },

  'Check `keyId` gets revalidated correctly': (client) => {
    const loginPage = client.page.swaggerUiLogin();

    loginPage
      .assert.cssClassPresent('@keyIdInput', 'error')
      .setValue('@keyIdInput', 't')
      .click('@keyInput')
      .assert.cssClassNotPresent('@keyIdInput', 'error');
  },

  'Check `key` gets revalidated correctly': (client) => {
    const loginPage = client.page.swaggerUiLogin();

    loginPage
      .assert.cssClassPresent('@keyInput', 'error')
      .setValue('@keyInput', 't')
      .click('@keyIdInput')
      .assert.cssClassNotPresent('@keyInput', 'error');
  },
};
