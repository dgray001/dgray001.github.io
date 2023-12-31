const path = require('path');
const config = require('./webpack.config.js');

module.exports = {
  ... config,
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/dist/',
  },
  devServer: {
    compress: true,
    liveReload: true,
    port: 8080,
    proxy: {
      '/server': 'http://127.0.0.1:3000', // php server
    },
    server: 'http',
    static: {
      directory: path.resolve(__dirname, 'docs/'),
      watch: {
        ignored: '**/data',
      },
    },
  },
}
