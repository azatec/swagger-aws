const path = require('path');
const webpack = require('webpack');

const pkg = require('./package.json');
const setupApp = require('./test/server');

const srcPath = path.resolve(__dirname, 'src');

module.exports = function buildConfig(env) {
  env = env || 'production'; // eslint-disable-line no-param-reassign

  const isDevelopment = env === 'development';
  const isProduction = !isDevelopment;

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
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    target: 'web',

    resolve: {
      alias: {
        querystring: 'querystring-browser',
        /* `webpack-dev-server` needs the 'real' crypto */
        crypto: isProduction
          ? path.resolve(srcPath, 'authorization/aws4-crypto-js.js')
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
          use: 'babel-loader',
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
    ].concat(!isProduction ? [] : [
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
      hints: isProduction ? 'error' : false,
      /* Bail out when a bundle would go past 100kB. At the time of writing we're
       * at 54kB for `Authorization` and 7.4kB for `Ui`, so this value should be
       * good for a while.
       */
      maxEntrypointSize: 102400,
    },

    devServer: {
      hot: false,
      inline: !isProduction,
      setup: app => setupApp(app, {
        serveDist: false,
      }),
    },
  };
};
