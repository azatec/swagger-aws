export default {
  Login: (client) => {
    const loginPage = client.page.swaggerUiLogin();

    loginPage
      .navigate(client.globals.url)
      .login('theKeyId', 'theKey');
  },
  'Try API call': (client) => {
    const getAccountPage = client.page.swaggerUiGetAccount();

    getAccountPage
      .expandGetAccount()
      .getAccount();

    getAccountPage.expect.element('@curl').text.to.contain('AWS4-HMAC-SHA256');
    getAccountPage.expect.element('@responseCode').text.to.contain('200');
    getAccountPage.expect.element('@responseBody').text.to.contain('YOUR NAME GOES HERE');

    client.end();
  },
};
