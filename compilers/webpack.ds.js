const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');

const front = {
  entry: {
    main: ['babel-polyfill', `./example/index.js`],
    vendors: ['react', 'react-dom']
  },
  devServer: {
    inline: true,
    contentBase: `./example`,
    historyApiFallback: true
  },
  devtool: 'eval',
  debug: true,
  externals: {},
  output: {
    path: path.join(__dirname, 'example'),
    filename: 'main.bundle.js'
  },
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  plugins: [
    // definePlugin(),
    new DashboardPlugin(),
    // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr|en/),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'front.vendors.js')
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
          cacheDirectory: true,
          presets: ['es2015', 'stage-0', 'react']
        }
      }
    ]
  }
};

module.exports = [front];