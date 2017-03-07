/* eslint-disable import/no-extraneous-dependencies, global-require */

require('babel-core/register');

const coverage = typeof process.env.E2E_COVERAGE !== 'undefined';
const headless = typeof process.env.E2E_HEADLESS !== 'undefined';
const reports =
  process.env.CIRCLE_TEST_REPORTS
    ? `${process.env.CIRCLE_TEST_REPORTS}/e2e`
    : './reports';

module.exports = {
  src_folders: [
    'test/e2e/scenarios',
  ],
  output_folder: reports,
  globals_path: 'test/e2e/globals.js',
  page_objects_path: 'test/e2e/pages',
  selenium: {
    start_process: !headless,
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
      /* In non-headless mode, the URL will be set in the `before` handler in
       * `globals.js`, depending on the port the Express server gets started on
       */
      launch_url: headless ? `http://swagger-aws:${coverage ? 9001 : 9000}` : null,
      screenshots: {
        enabled: true,
        path: `${reports}/screenshots`,
        on_error: true,
        on_failure: true,
      },
    },
    firefox: {
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
