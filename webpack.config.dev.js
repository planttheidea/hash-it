const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');

const PORT = 3000;

module.exports = {
  cache: true,

  debug: true,

  devServer: {
    contentBase: './dist',
    host: 'localhost',
    inline: true,
    lazy: false,
    noInfo: false,
    quiet: false,
    port: PORT,
    stats: {
      colors: true,
      progress: true
    }
  },

  devtool: 'source-map',

  entry: [
    path.resolve(__dirname, 'DEV_ONLY', 'App.js')
  ],

  eslint: {
    configFile: '.eslintrc',
    emitError: true,
    failOnError: true,
    failOnWarning: false,
    formatter: eslintFriendlyFormatter
  },

  module: {
    preLoaders: [
      {
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'eslint-loader',
        test: /\.js$/
      }
    ],

    loaders: [
      {
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'DEV_ONLY')
        ],
        loader: 'babel',
        query: {
          plugins: [
            'transform-runtime',
            'add-module-exports'
          ],
          presets: [
            'es2015-loose',
            'react',
            'stage-0'
          ]
        },
        test: /\.js$/
      }
    ]
  },

  output: {
    filename: 'hash-it.js',
    library: 'hashIt',
    path: path.resolve(__dirname, 'dist'),
    publicPath: `http://localhost:${PORT}/`,
    umdNamedDefine: true
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ]),
    new HtmlWebpackPlugin()
  ],

  resolve: {
    extensions: [
      '',
      '.js'
    ],

    fallback: [
      path.join(__dirname, 'src')
    ],

    root: __dirname
  }
};