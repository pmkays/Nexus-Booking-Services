const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const packageJson = require('./package.json');

const getMode = () => {
  let stageIndex = process.argv.findIndex(arg => arg === '--mode');
  if (stageIndex !== -1) return process.argv[++stageIndex];
  return 'development';
};

const isProduction = getMode() === 'production';
const devServerPort = 8000;

const config = {
  context: path.join(__dirname, 'src'),
  entry: {
    bundle: [
      './index.tsx',
      'react-hot-loader/index',
    ],
    vendor: [
      'whatwg-fetch',
      'react',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: '[name].[hash].js.map',
    filename: '[name].[hash].js',
    publicPath: '/',
    pathinfo: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  target: 'web',
  devtool: isProduction ? 'none' : 'cheap-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: false,
          experimentalWatchApi: true,
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      // static assets
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.(svg)$/, use: 'url-loader?limit=10000' },
      { test: /\.(jpg|gif|png)$/, use: 'file-loader' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
      { test: /\.(woff|woff2)$/, loader: 'url-loader?prefix=font/&limit=5000' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
    ],
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'src/assets'),
    hot: true,
    inline: true,
    port: devServerPort,
  },
  optimization: {
    sideEffects: false,
    minimize: false,
    splitChunks: {
      name: 'vendor',
      filename: 'vendor.[hash].js',
      chunks: 'all',
    },
    runtimeChunk: true,
  },
  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'es6-promise-promise',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(getMode()),
      'process.env.RELEASE': JSON.stringify(packageJson.version),
      'process.env.DEV_API_URL': JSON.stringify('http://localhost:3000/v1d/'),
      'process.env.PROD_API_URL': JSON.stringify('http://localhost:3000/v1/'),
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      cache: false,
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/assets'),
        to: path.resolve(__dirname, 'dist'),
      },
    ]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

if (!isProduction) {
  config.entry.bundle.push('webpack/hot/only-dev-server');
  config.entry.bundle.push(`webpack-dev-server/client?http://localhost:${devServerPort}`);
}

if (isProduction) {
  config.plugins.push(new UglifyJsPlugin({
    sourceMap: false,
    parallel: true,
  }));
}

module.exports = config;
