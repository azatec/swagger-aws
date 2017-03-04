/* eslint-disable import/no-extraneous-dependencies, global-require */

require('babel-core/register');

module.exports = {
  src_folders: [
    'test/e2e/scenarios',
  ],
  output_folder: './reports',
  globals_path: 'test/e2e/globals.js',
  page_objects_path: 'test/e2e/pages',
  selenium: {
    start_process: true,
    server_path: require('selenium-server-standalone-jar').path,
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': require('chromedriver').path,
      'webdriver.gecko.driver': require('geckodriver').path,
    },
  },
  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: 'firefox',
      },
    },
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
      },
    },
  },
};
