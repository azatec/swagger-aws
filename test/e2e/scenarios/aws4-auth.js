import { afterScenario } from '../globals';

export default {
  after: afterScenario,

  Login: (client) => {
    client
      .url(client.launchUrl ? client.launchUrl : client.globals.launchUrl);

    const loginPage = client.page.swaggerUiLogin();

    loginPage
      .openDialog();

    loginPage.expect.element('@authorizeDialog').text.to.contain('demo');
    loginPage.expect.element('@authorizeDialog').text.to.contain('be-east-1');

    loginPage
      .login('theKeyId', 'theKey');
  },
  'Try API call': (client) => {
    const getAccountPage = client.page.swaggerUiGetAccount();

    getAccountPage
      .expandGetAccount()
      .getAccount();

    getAccountPage.expect.element('@curl').text.to.contain('AWS4-HMAC-SHA256');
    getAccountPage.expect.element('@curl').text.to.contain('theKeyId');
    getAccountPage.expect.element('@curl').text.to.contain('be-east-1');
    getAccountPage.expect.element('@responseCode').text.to.contain('200');
    getAccountPage.expect.element('@responseBody').text.to.contain('YOUR NAME GOES HERE');
  },

  'Check the region is displayed in the authorizations panel': (client) => {
    const loginPage = client.page.swaggerUiLogin();

    loginPage
      .openDialog();

    loginPage.expect.element('@authorizeDialog').text.to.contain('be-east-1');

    loginPage
      .closeDialog();
  },

  'Check the key ID is displayed in the authorizations panel': (client) => {
    const loginPage = client.page.swaggerUiLogin();

    loginPage
      .openDialog();

    loginPage.expect.element('@authorizeDialog').text.to.contain('theKeyId');
  },
};
