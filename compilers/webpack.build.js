const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');

const front = {
  entry: {
    main: `./src/ButtonActions.js`
  },
  devtool: 'cheap-module-source-map',
  debug: false,
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
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  plugins: [
    new DashboardPlugin(),
    new webpack.optimize.DedupePlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.css', '.ttf', '.eot', '.woff'],
    modulesDirectories: ['node_modules']
  },
  module: {
    loaders: [
      {
        test: require.resolve("react-addons-perf"),
        loader: "expose?Perf"
      },
      { test: /\.css$/, loaders: ['style', 'css'] },
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          cacheDirectory: false,
          presets: ['es2015', 'stage-0', 'react', 'react-optimize'],
          plugins: [
            'transform-runtime'
          ]
        }
      }
    ]
  }
};

module.exports = [front];