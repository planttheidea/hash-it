const path = require('path');
const webpack = require('webpack');

module.exports = {
  cache: true,

  debug: true,

  devtool: 'source-map',

  entry: [
    path.resolve(__dirname, 'src', 'index.js')
  ],

  eslint: {
    configFile: '.eslintrc',
    emitError: true,
    failOnError: true,
    failOnWarning: false,
    formatter: require('eslint-friendly-formatter')
  },

  externals: {
    'stringifier': {
      amd: 'stringifier',
      commonjs: 'stringifier',
      commonjs2: 'stringifier',
      root: 'stringifier'
    }
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
            'add-module-exports'
          ],
          presets: [
            ['latest', {
              loose: true
            }],
            'stage-2'
          ]
        },
        test: /\.js$/
      }
    ]
  },

  output: {
    filename: 'hash-it.js',
    library: 'hashIt',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ])
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
