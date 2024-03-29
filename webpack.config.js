module.exports = {
  entry: {
    index: {
      import: './src/pages/home/home.ts',
    },
    secondary: {
      import: './src/pages/secondary/secondary.ts',
    },
    admin: {
      import: './src/pages/admin/admin.ts',
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
