import { afterScenario } from '../globals';

export default {
  after: afterScenario,

  Login: (client) => {
    client
      .url(client.launchUrl ? client.launchUrl : client.globals.launchUrl);

    const loginPage = client.page.swaggerUiLogin();

    loginPage
      .openDialog();

    loginPage.expect.element('@authorizeDialog').text.to.contain('Basic HTTP authentication');

    loginPage
      .basicLogin('theUsername', 'thePassword');
  },
  'Try API call': (client) => {
    const getAccountPage = client.page.swaggerUiGetAccount();

    getAccountPage
      .expandGetAccount()
      .getAccount();

    getAccountPage.expect.element('@curl').text.to.contain('Basic dGhlVXNlcm5hbWU6dGhlUGFzc3dvcmQ=');
    getAccountPage.expect.element('@responseCode').text.to.contain('200');
    getAccountPage.expect.element('@responseBody').text.to.contain('theUsername');
  },

  'Check the username is displayed in the authorizations panel': (client) => {
    const loginPage = client.page.swaggerUiLogin();

    loginPage
      .openDialog();

    loginPage.expect.element('@authorizeDialog').text.to.contain('theUsername');
  },
};
