const path = require('path');
const webpack = require('webpack');

const pkg = require('./package.json');
const setupApp = require('./test/server');

const srcPath = path.resolve(__dirname, 'src');

module.exports = function buildConfig(env) {
  /* The rules:
   *
   * +-------------+----------+----------+-------------------+--------+----------+
   * | Build Type  | Minified | Coverage |    Source Map     | Reload | CryptoJS |
   * +=============+==========+==========+===================+========+==========+
   * | Production  |    Y     |     N    |    source-map     |    N   |    Y     |
   * +-------------+----------+----------+-------------------+--------+----------+
   * | Coverage    |    Y     |     Y    | inline-source-map |    N   |    Y     |
   * +-------------+----------+----------+-------------------+--------+----------+
   * | Development |    N     |     N    |  eval-source-map  |    Y   |    N     |
   * +-------------+----------+----------+-------------------+--------+----------+
   *
   * - Any build type which is not 'coverage' or 'development' is 'production'.
   * - 'coverage' and 'production' are the same, except for source map location
   *   and coverage annotations.
   */

  env = env || 'production'; // eslint-disable-line no-param-reassign

  const isCoverage = env === 'coverage';
  const isDevelopment = env === 'development';
  const isProduction = !isDevelopment && !isCoverage;

  const minified = isProduction || isCoverage;
  const coverage = isCoverage;
  const sourceMap = (() => {
    if (isCoverage) {
      return 'inline-source-map';
    }
    if (isDevelopment) {
      return 'eval-source-map';
    }
    return 'source-map';
  })();
  const reload = isDevelopment;
  const cryptoJs = !reload;

  return {
    context: srcPath,

    entry: {
      Authorization: './authorization/index.js',
      Ui: './ui/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `SwaggerAws.[name]-${pkg.version}.min.js`,
      library: ['SwaggerAws', '[name]'],
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
    devtool: sourceMap,
    target: 'web',

    resolve: {
      alias: {
        querystring: 'querystring-browser',
        /* `webpack-dev-server` 'inline' reload needs the 'real' crypto */
        crypto: cryptoJs ? path.resolve(srcPath, 'authorization/aws4-crypto-js.js')
                         : 'crypto',
      },
    },

    externals: {
      jquery: {
        commonjs: 'jquery',
        commonjs2: 'jquery',
        amd: 'jquery',
        root: 'jQuery',
      },
      backbone: {
        commonjs: 'backbone',
        commonjs2: 'backbone',
        amd: 'backbone',
        root: 'Backbone',
      },
      'swagger-ui': 'SwaggerUi',
      'handlebars/runtime': {
        commonjs: 'handlebars',
        commonjs2: 'handlebars',
        amd: 'handlebars',
        root: 'Handlebars',
      },
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_',
      },
      'sanitize-html': {
        commonjs: 'sanitize-html',
        commonjs2: 'sanitize-html',
        amd: 'sanitize-html',
        root: 'sanitizeHtml',
      },
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          exclude: /node_modules/,
          use: 'eslint-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: coverage ? ['istanbul'] : [],
              },
            },
          ],
        },
        {
          test: /\.handlebars$/,
          use: [
            {
              loader: 'handlebars-loader',
              options: {
                helperDirs: [
                  path.resolve(srcPath, 'handlebars-helpers'),
                ],
               /* This needs to be set such that Handlebars doesn't get included
                * in the bundle (which is not required: it's an 'external').
                * The reason: `handlebars-loader` uses the result of
                * `require.resolve('handlebars/runtime')` in the code it
                * generates, which is a path to the Handlebars package installed
                * in `node_modules`. As such the 'externals' recognition doesn't
                * kick in, and the runtime gets included in the bundle.
                * When setting it as an option, the string is used as-is.
                */
                runtime: 'handlebars/runtime',
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env),
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: ['Ui', 'Authorization'],
      }),
    ].concat(!minified ? [] : [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
        sourceMap: true,
        beautify: false,
        comments: false,
        extractComments: false,
      }),
    ]),

    performance: {
      /* Only really care for 'production' builds: others include stuff we
       * shouldn't account for size-wise (hot reload, coverage annotations,...)
       */
      hints: isProduction ? 'error' : false,
      /* Bail out when a bundle would go past 100kB. At the time of writing we're
       * at 54kB for `Authorization` and 7.4kB for `Ui`, so this value should be
       * good for a while.
       */
      maxEntrypointSize: 102400,
    },

    devServer: {
      hot: false,
      inline: reload,
      setup: app => setupApp(app, {
        serveDist: false,
      }),
    },
  };
};
