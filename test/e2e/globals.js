import app from '../server';

const headless = typeof process.env.E2E_HEADLESS !== 'undefined';

module.exports = {
  waitForConditionTimeout: 1000,

  before(done) {
    if (!headless) {
      const server = app.listen(0, 'localhost', () => {
        const { address, family, port } = server.address();
        const addr = family === 'IPv4' ? address : `[${address}]`;
        this.launchUrl = `http://${addr}:${port}`;
        done();
      });
      this.server = server;
    } else {
      done();
    }
  },

  after(done) {
    if (this.server) {
      this.server.close(done);
    } else {
      done();
    }
  },
};
