import app from './server';

module.exports = {
  before(done) {
    const server = app.listen(0, 'localhost', () => {
      const { address, family, port } = server.address();
      const addr = family === 'IPv4' ? address : `[${address}]`;
      this.url = `http://${addr}:${port}`;
      app.serverUrl = this.url;
      done();
    });
    this.server = server;
  },

  after(done) {
    this.server.close(done);
  },
};
