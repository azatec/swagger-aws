/* eslint-disable no-console */

import express from 'express';
import * as mkdirp from 'mkdirp';
import sanitizeFilename from 'sanitize-filename';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import * as path from 'path';
import * as fs from 'fs';

import webpackConfig from '../../webpack.config';
import setupApp from '../server';

const coverage = typeof process.env.E2E_COVERAGE !== 'undefined';
const headless = typeof process.env.E2E_HEADLESS !== 'undefined';

if (coverage && headless) {
  throw new Error('Coverage and headless mode are mutually exclusive');
}

const storeCoverage = (browser, done) =>
  browser.execute(
    coverageField => window[coverageField],
    ['__coverage__'],
    (result) => {
      try {
        if (result.status !== 0 || result.value === null) {
          throw new Error('Failed to retrieve coverage from browser');
        }

        const pathParts = [
          'coverage',
          'e2e',
        // eslint-disable-next-line no-underscore-dangle
          process.env.__NIGHTWATCH_ENV_KEY || 'unknown',
          browser.currentTest.module || '',
          browser.currentTest.group || '',
          browser.currentTest.naame || '',
        ]
        .map(s => s.replace(/\s/gi, '-'))
        .map(sanitizeFilename);

        const folder = path.join.apply(null, pathParts);
        const filename = 'coverage.json';

        mkdirp.sync(folder);

        const filePath = path.join(folder, filename);
        fs.writeFileSync(filePath, JSON.stringify(result.value));
      } catch (exc) {
        console.log('Error while storing coverage results', exc);
      } finally {
        done();
      }
    });


module.exports = {
  waitForConditionTimeout: 1000,

  before(done) {
    if (headless) {
      /* In headless mode, there should be a server running already */
      done();
      return;
    }

    let server = null;

    const serverCreated = () => {
      const { address, family, port } = server.address();
      const addr = family === 'IPv4' ? address : `[${address}]`;
      this.launchUrl = `http://${addr}:${port}`;
      done();
    };

    /* This is a bit of a mess, but `express` and `webpack-dev-server` have a
     * slightly different approach. See
     * https://github.com/webpack/webpack-dev-server/issues/828 for some
     * ramblings.
     */
    if (coverage) {
      const config = webpack(webpackConfig('coverage'));
      const options = {
        setup: app => setupApp(app, {
          serveDist: false,
        }),
        quiet: true,
      };
      this.server = new WebpackDevServer(config, options);
      server = this.server.listen(0, 'localhost', serverCreated);
    } else {
      server = setupApp(express()).listen(0, 'localhost', serverCreated);
      this.server = server;
    }
  },

  after(done) {
    if (this.server) {
      this.server.close(done);
    } else {
      done();
    }
  },

  afterScenario: (browser, done) => {
    const cb = () => browser.end(done);

    if (coverage && browser.sessionId) {
      storeCoverage(browser, cb);
    } else {
      cb();
    }
  },
};
