module.exports = {
  entry: {
    index: {
      import: './src/pages/index.ts',
    },
    admin: {
      import: './src/pages/admin_dashboard.ts',
    },
    download: {
      import: './src/pages/download.ts',
    },
    profile: {
      import: './src/pages/profile.ts',
    },
    wiki: {
      import: './src/pages/wiki.ts',
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}