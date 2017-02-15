// Webpack dependencies
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

// Path definitions
const buildRoot = path.resolve(__dirname, '../../');

module.exports = {
  // Two discrete module entry points
  entry: {
    global: [
      'public/bootstrap/js/bootstrap.min.js',
      'client/js/app/app.js',
      'client/sass/screen.scss',
    ],
  },

  // Define module outputs
  output: {
    path: 'public/static/',
    filename: 'js/[name].bundle.js',
  },

  // So we can put config files in config/
  eslint: {
    configFile: path.join(__dirname, '.eslintrc'),
  },

  // Where webpack resolves modules
  resolve: {
    root: buildRoot,
    modulesDirectories: [
      'node_modules',
    ],
  },

  // Enable require('jquery') where jquery is already a global
  externals: {
    'jquery': 'jQuery',
  },

  plugins: [
    new ExtractTextPlugin('css/[name].css'),
    new LiveReloadPlugin({ appendScriptTag: true }),
    new webpack.NoErrorsPlugin(),
  ],

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          /public/,
        ],
        loader: 'eslint',
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader',
          'css?sourceMap!autoprefixer-loader' +
          '!sass?outputStyle=compact&sourceMap=true&sourceMapContents=true'
        ),
      },
      {
        test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=image/svg+xml',
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=application/octet-stream',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
    ],
  },
}