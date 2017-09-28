const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const front = {
  entry: {
    main: `./src/ButtonActions.js`
  },
  devtool: 'cheap-module-source-map',
  bail: true,
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  },
  output: {
    path: path.join(__dirname, '../', '/dist/'),
    filename: 'index.js',
    library: 'ReactButtonActions',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      beautify: false,
      parallel: true,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true,
        screw_ie8: true
      },
      mangle: {
        except: [
          '$', 'webpackJsonp'
        ],
        screw_ie8: true,
        keep_fnames: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    })
  ],
  resolve: {
    extensions: ['.js', '.css', '.ttf', '.eot', '.woff'],
    modules: ['node_modules']
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader']},
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: false,
            presets: ['env', ["es2015", { "loose": true, "modules": false }], 'stage-0', 'react', 'react-optimize'],
            plugins: [
              'transform-runtime',
              'transform-decorators-legacy'
            ]
          }
        }
      },
      { test: /\.(eot|ttf|woff|jpg|png|gif|svg)/, use: 'url-loader' }
    ]
  }
};

module.exports = front;