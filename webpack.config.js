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
    handlebars: {
      commonjs: 'handlebars',
      commonjs2: 'handlebars',
      amd: 'handlebars',
      root: 'Handlebars',
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
