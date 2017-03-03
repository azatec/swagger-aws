const path = require('path');
const webpack = require('webpack');

const pkg = require('./package.json');

const srcPath = path.resolve(__dirname, 'src');

module.exports = {
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
  devtool: 'source-map',
  target: 'web',

  resolve: {
    alias: {
      querystring: 'querystring-browser',
      crypto: path.resolve(srcPath, 'authorization/aws4-crypto-js.js'),
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
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true,
      beautify: false,
      comments: false,
      extractComments: false,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['Ui', 'Authorization'],
    }),
  ],
};
