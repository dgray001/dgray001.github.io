module.exports = {
  entry: {
    index: {
      import: './src/pages/index.ts',
    },
    secondary: {
      import: './src/pages/secondary.ts',
    },
    admin_dashboard: {
      import: './src/pages/admin_dashboard.ts',
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