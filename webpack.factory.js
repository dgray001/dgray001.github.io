const path = require('path');
const webpack = require('webpack');

const repoRoot = __dirname;

function makeConfig({ siteDir, mode }) {
  const isProd = mode === 'production';
  return {
    mode,
    entry: {
      index: { import: path.resolve(siteDir, 'src/pages/home/home.ts') },
      secondary: { import: path.resolve(siteDir, 'src/pages/secondary/secondary.ts') },
      admin: { import: path.resolve(siteDir, 'src/pages/admin/admin.ts') },
    },
    module: {
      rules: [
        { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'], exclude: /node_modules/ },
        { test: /\.html$/i, loader: 'html-loader', exclude: /node_modules/ },
        { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@core': path.resolve(repoRoot, 'core/src'),
        '@site': path.resolve(siteDir, 'src'),
      },
    },
    resolveLoader: { modules: [path.resolve(repoRoot, 'node_modules'), 'node_modules'] },
    plugins: [
      new webpack.DefinePlugin({
        DEV: JSON.stringify(!isProd),
        STAGING: JSON.stringify(process.env.STAGING === 'true'),
      }),
    ],
    output: {
      filename: '[name].bundle.js',
      path: isProd ? path.resolve(siteDir, 'docs/dist') : path.resolve(siteDir, 'dist'),
      publicPath: '/dist/',
    },
    ...(isProd ? {} : {
      devServer: {
        compress: true,
        liveReload: true,
        port: 8080,
        proxy: [{ context: ['/server'], target: 'http://localhost:3000' }],
        server: 'http',
        static: { directory: path.resolve(siteDir, 'docs'), watch: { ignored: '**/data' } },
      },
    }),
  };
}

module.exports = makeConfig;
