module.exports = require('../../webpack.factory')({
  siteDir: __dirname,
  mode: 'production',
  basePath: process.env.BASE_PATH || '',
});
