const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';

const frontendSrc = path.resolve(__dirname, 'src');

const plugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(pkg.version)
  }),
  new HtmlWebpackPlugin({
    publicPath: '/',
    template: path.resolve(frontendSrc, 'index.html')
  })
];

module.exports = {
  devtool: isProduction ? false : 'eval-source-map',
  entry: {
    app: path.join(frontendSrc, 'index.tsx')
  },
  mode,
  module: {
    rules: [
      {
        exclude: [/node_modules/],
        loader: 'ts-loader',
        test: /\.tsx?$/
      },
      {
        test: /\.(png|eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        type: 'asset/resource'
      }
    ]
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, '..', 'public')
  },
  plugins,
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    fallback: {
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
      timers: require.resolve('timers-browserify')
    },
    modules: [frontendSrc, 'node_modules']
  }
};
