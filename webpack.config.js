const path = require('path');

const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const Visualizer = require('webpack-visualizer-plugin');

const srcPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');

const isProduction = process.env.NODE_ENV === 'production';

const commonPlugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: '[name].[hash].js',
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
    },
  }),
  new HtmlWebpackPlugin({
    template: HtmlWebpackTemplate,
    title: 'Swagger UI',
    inject: false,
    minify: {
      collapseWhitespace: true,
    },
  }),
];

const productionPlugins = [
  ...commonPlugins,
  new ExtractTextPlugin({
    filename: '[name].[chunkhash].css',
    allChunks: true,
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
    },
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 15 }),
  new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }),
  new CompressionPlugin({
    threshold: 1024,
  }),
];

const developmentPlugins = [
  ...commonPlugins,
  new webpack.HotModuleReplacementPlugin(),
  new Visualizer(),
];

module.exports = {
  context: srcPath,

  entry: {
    app: './index.js',
    vendor: [
      /* Special-case: `swagger-ui` doesn't pull in all it dependencies, those
       * are only 'listed' in `swagger-ui-lib`, so making sure we ensure that
       * one
       */
      './swagger-ui-lib',
      'aws4',
      'backbone',
      'handlebars/runtime',
      'highlight.js',
      'jquery',
      'querystring-browser',
      'sanitize-html',
    ],
  },
  output: {
    path: distPath,
    filename: isProduction ? '[name].[chunkhash].js' : 'app.js',
  },

  devtool: isProduction ? 'hidden-source-map' : 'source-map',

  devServer: {
    contentBase: distPath,
    compress: true,
    hot: true,
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader',
        ],
      },
      {
        test: /node_modules\/swagger-ui\/lib\/.*\.js$/,
        loaders: [
          'script-loader',
        ],
      },
      {
        test: /node_modules\/swagger-ui\/src\/main\/.*\.js$/,
        loaders: [
          `imports-loader?${[
            'SwaggerClient=swagger-client',
            'sanitizeHtml=sanitize-html',
            'Handlebars=handlebars/runtime',
            'marked=marked',
          ].join('&')}`,
        ],
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(gif|png)$/,
        loaders: [
          'url-loader?limit=100000',
        ],
      },
      {
        test: /\.ttf$/,
        loaders: [
          'file-loader',
        ],
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader',
        query: {
          helperDirs: [
            path.resolve(srcPath, 'helpers'),
          ],
        },
      },
    ],
  },

  plugins: isProduction ? productionPlugins : developmentPlugins,

  resolve: {
    alias: {
      b: path.resolve(srcPath, 'b.js'), // See `src/b.js`
      backbone: 'swagger-ui/lib/backbone-min.js',
      'highlight.js': 'swagger-ui/lib/highlight.9.1.0.pack.js',
      jquery: 'swagger-ui/lib/jquery-1.8.0.min.js',
      querystring: 'querystring-browser',
    },
  },
};
