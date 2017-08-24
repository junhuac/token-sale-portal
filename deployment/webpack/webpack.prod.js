/* eslint-disable global-require */

const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const utils = require('./utils');

module.exports = require('./webpack.base')({
  // In production, we skip all hot-reloading stuff.
  entry: [
    'whatwg-fetch',
    path.join(process.cwd(), 'frontend/src/main.js'),
  ],

  // Utilize long-term caching by adding content hashes (not compilation hashes)
  // to compiled assets.
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    path: path.resolve(process.cwd(), 'build', 'frontend'),
    publicPath: '/',
  },

  plugins: [
    new WebpackMd5Hash(),

    // Extract the CSS into a seperate file.
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true,
    }),

    // Minify and optimize the index.ejs
    new HtmlWebpackPlugin({
      inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
      templateContent: templateContent(), // eslint-disable-line
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ],

  // Load the CSS in a style tag in development
  cssLoaders: [
    { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: {
        modules: true,
        importLoaders: true,
      },
    },
    { loader: 'postcss-loader' },
  ]
});
