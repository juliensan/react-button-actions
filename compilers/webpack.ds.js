const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const front = {
  entry: {
    main: [`./example/index.js`],
    vendors: ['react', 'react-dom']
  },
  devServer: {
    inline: true,
    compress: true,
    contentBase: path.join(__dirname, '../', 'example'),
    historyApiFallback: {
      index: '/'
    }
  },
  devtool: 'eval',
  externals: {},
  output: {
    path: path.join(__dirname, '../', 'example'),
    filename: "./[name].bundle.js",
    publicPath: '/',
    chunkFilename : './[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
       title: 'React Action Buttons Example Page @ dev server',
       template: path.join(__dirname, 'templates', 'index-dev.ejs')
    }),
    new DashboardPlugin(),
    // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr|en/),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors'
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
            cacheDirectory: true,
            presets: ['env', 'es2015', 'stage-0', 'react']
          }
        }
      },
      { test: /\.(eot|ttf|woff|jpg|png|gif|svg)/, use: 'url-loader' }
    ]
  }
};

module.exports = [front];